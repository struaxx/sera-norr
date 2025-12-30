import { toast } from "sonner";

// Shopify API Configuration
export const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STORE_PERMANENT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ygc1q1-4j.myshopify.com';
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

// Types
export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

// GraphQL Queries
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              name
              values
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// API Helper with comprehensive error handling
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  // Validate token exists
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    toast.error("Shopify configuratie ontbreekt", {
      description: "Neem contact op met de beheerder.",
    });
    return null;
  }

  // Request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle specific error codes
    if (response.status === 402) {
      toast.error("Shopify: Betaling vereist", {
        description: "Shopify API-toegang vereist een actief abonnement.",
      });
      return null;
    }

    if (response.status === 429) {
      toast.error("Te veel verzoeken", {
        description: "Probeer het over een moment opnieuw.",
      });
      return null;
    }

    if (response.status === 401 || response.status === 403) {
      toast.error("Verbinding met winkel niet mogelijk", {
        description: "Neem contact op met de beheerder.",
      });
      return null;
    }

    if (response.status >= 500) {
      toast.error("Winkel tijdelijk niet beschikbaar", {
        description: "Probeer het later opnieuw.",
      });
      return null;
    }

    if (!response.ok) {
      toast.error("Er ging iets mis", {
        description: "Probeer het later opnieuw.",
      });
      return null;
    }

    const data = await response.json();
    
    if (data.errors) {
      toast.error("Er ging iets mis bij het laden", {
        description: "Probeer het later opnieuw.",
      });
      return null;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      toast.error("Verbinding timeout", {
        description: "Probeer het later opnieuw.",
      });
    } else {
      toast.error("Netwerkfout", {
        description: "Controleer uw internetverbinding.",
      });
    }
    return null;
  }
}

// Fetch all products
export async function fetchProducts(first: number = 20, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query });
  if (!data) return [];
  return data.data.products.edges;
}

// Fetch single product by handle
export async function fetchProductByHandle(handle: string) {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data) return null;
  return data.data.productByHandle;
}

// Collection types
export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
  };
}

// Fetch all collections
export async function fetchCollections(first: number = 10): Promise<ShopifyCollection[]> {
  const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first });
  if (!data) return [];
  return data.data.collections.edges;
}

// Fetch single collection with products
export async function fetchCollectionByHandle(handle: string, productCount: number = 20) {
  const data = await storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, { handle, first: productCount });
  if (!data) return null;
  return data.data.collection;
}
