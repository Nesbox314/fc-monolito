import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { InvoiceItemModel } from "../repository/invoice-item.model";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a invoice", async () => {
    await InvoiceModel.create(
        {
            id: "1",
            name: "Invoice 1",
            document: "Document 1",
            street: "Street 1",
            number: "Number 10",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zip 1",
            items: [{
                id: "1",
                name: "Item 1",
                price: 10,
                invoice_id: "1",
                createdAt: new Date(),
                updatedAt: new Date()
            }],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            include: [{ model: InvoiceItemModel }],
        }
    );

    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      id: "1"
    };

    let invoice = await invoiceFacade.find(input);

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe("1");
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.document).toBe("Document 1");
    expect(invoice.address.street).toBe("Street 1");
    expect(invoice.address.number).toBe("Number 10");
    expect(invoice.address.complement).toBe("Complement 1");
    expect(invoice.address.city).toBe("City 1");
    expect(invoice.address.state).toBe("State 1");
    expect(invoice.address.zipCode).toBe("Zip 1");
    expect(invoice.items).toHaveLength(1);
    expect(invoice.items[0].id).toBe("1");
    expect(invoice.items[0].name).toBe("Item 1");
    expect(invoice.items[0].price).toBe(10);
    expect(invoice.createdAt).toBeDefined();
  });

  it("should generate a invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "ZipCode 1",
      items: [{ id: "1", name: "Item 1", price: 10 }]
    };

    let invoice = await invoiceFacade.generate(input);

    expect(invoice).toBeDefined();
    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.document).toBe("Document 1");
    expect(invoice.street).toBe("Street 1");
    expect(invoice.number).toBe("Number 1");
    expect(invoice.complement).toBe("Complement 1");
    expect(invoice.city).toBe("City 1");
    expect(invoice.state).toBe("State 1");
    expect(invoice.zipCode).toBe("ZipCode 1");
    expect(invoice.items).toHaveLength(1);
    expect(invoice.items[0].id).toBe("1");
    expect(invoice.items[0].name).toBe("Item 1");
    expect(invoice.items[0].price).toBe(10);
  });
});
