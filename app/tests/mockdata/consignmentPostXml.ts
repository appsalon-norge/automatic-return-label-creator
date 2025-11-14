const mockData = {
  returnApproveRequest: {
    return: {
      reverseFulfillmentOrders: {
        edges: [
          {
            node: {
              // Example reverse fulfillment order id used for XML value reversefulfillmentorders
              id: "RFO-1001",
              lineItems: {
                edges: [
                  {
                    node: {
                      // Mimic ReverseFulfillmentOrderLineItem shape
                      id: "RFO-LI-1",
                      totalQuantity: 2,
                      fulfillmentLineItem: {
                        id: "FUL-LI-1",
                        lineItem: {
                          id: "LINE-1",
                          name: "Test Product",
                        },
                      },
                    },
                  },
                  {
                    node: {
                      id: "RFO-LI-2",
                      totalQuantity: 1,
                      fulfillmentLineItem: {
                        id: "FUL-LI-2",
                        lineItem: {
                          id: "LINE-2",
                          name: "Second Product",
                        },
                      },
                    },
                  },
                ],
              },
              // Mock order and customer data
              order: {
                name: "1001",
                customer: {
                  displayName: "John Doe",
                },
              },
            },
          },
          // Second example reverse fulfillment order to demonstrate array handling
          {
            node: {
              id: "RFO-1002",
              lineItems: {
                edges: [
                  {
                    node: {
                      id: "RFO-LI-3",
                      totalQuantity: 3,
                      fulfillmentLineItem: {
                        id: "FUL-LI-3",
                        lineItem: {
                          id: "LINE-3",
                          name: "Another Product",
                        },
                      },
                    },
                  },
                ],
              },
              order: {
                name: "1002",
                customer: {
                  displayName: "Jane Doe",
                },
              },
            },
          },
        ],
      },
      // Mock billing address and customer email/phone
      order: {
        billingAddress: {
          name: "John Doe",
          address1: "123 Test St",
          zip: "12345",
          city: "Testville",
          phone: "1234567890",
        },
        customer: {
          email: "john.doe@example.com",
          phone: "1234567890",
        },
      },
    },
  },
  // Mock parsed consignments (similar shape to parseConsignmentsXml output) used by prepareLabels
  consignments: [
    {
      "consignment-pdf":
        "https://sandbox.cargonizer.no/consignments/label_pdf?id=79758",
      values: {
        value: [
          { "@_name": "reversefulfillmentorders", "@_value": "RFO-1001" },
          { "@_name": "orderno", "@_value": "1001" },
        ],
      },
    },
    {
      "consignment-pdf":
        "https://sandbox.cargonizer.no/consignments/label_pdf?id=79759",
      values: {
        value: [
          { "@_name": "reversefulfillmentorders", "@_value": "RFO-1002" },
          { "@_name": "orderno", "@_value": "1002" },
        ],
      },
    },
  ],
} as any; // Cast to any to simplify the mock

export default mockData;
