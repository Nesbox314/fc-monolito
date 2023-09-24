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

  it("should find a product", async () => {
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
  });
});
