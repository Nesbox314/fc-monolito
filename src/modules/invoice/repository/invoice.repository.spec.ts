import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import InvoiceItem from "../domain/invoice-item";
import InvoiceRepository from "./invoice.repository";
import { InvoiceItemModel } from "./invoice-item.model";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("InvoiceRepository test", () => {
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
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 20,
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

        const invoiceRepository = new InvoiceRepository();
        const invoice = await invoiceRepository.find("1");

        expect(invoice.id.id).toBe("1");
        expect(invoice.name).toBe("Invoice 1");
        expect(invoice.document).toBe("Document 1");
        expect(invoice.address.street).toBe("Street 1");
        expect(invoice.address.number).toBe("Number 10");
        expect(invoice.address.complement).toBe("Complement 1");
        expect(invoice.address.city).toBe("City 1");
        expect(invoice.address.state).toBe("State 1");
        expect(invoice.address.zipCode).toBe("Zip 1");
        expect(invoice.items).toHaveLength(2);
        expect(invoice.items[0].name).toBe("Item 1");
        expect(invoice.items[0].price).toBe(10);
        expect(invoice.items[1].name).toBe("Item 2");
        expect(invoice.items[1].price).toBe(20);
        expect(invoice.createdAt).toBeDefined();
        expect(invoice.updatedAt).toBeDefined();
    });
});