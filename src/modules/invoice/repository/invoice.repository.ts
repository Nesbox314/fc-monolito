import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async find(id: string): Promise<Invoice> {
        let invoice = await InvoiceModel.findOne({
            where: { id: id },
            include: ["items"],
        });

        let address = new Address(
            invoice.street,
            invoice.number,
            invoice.complement,
            invoice.city,
            invoice.state,
            invoice.zipCode
        );

        let items = invoice.items.map((item) => (
            new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })
        ))

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: address,
            items: items,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        })
    }

    async generate(invoice: Invoice): Promise<Invoice> {
        let newInvoice = await InvoiceModel.create(
            {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
                items: invoice.items.map((item) => (
                    {
                        id: item.id.id,
                        name: item.name,
                        price: item.price,
                        invoice_id: invoice.id.id,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    }
                )),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                include: [{ model: InvoiceItemModel }],
            }
        );

        return new Invoice({
            id: new Id(newInvoice.id),
            name: newInvoice.name,
            document: newInvoice.document,
            address: new Address(newInvoice.street, newInvoice.number, newInvoice.complement, newInvoice.city, newInvoice.state, newInvoice.zipCode),
            items: newInvoice.items.map((item) => (
                new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price
                })
            )),
            createdAt: newInvoice.createdAt,
            updatedAt: newInvoice.updatedAt
        })
    }
}