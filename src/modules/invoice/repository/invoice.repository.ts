import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
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

    generate(invoice: Invoice): Promise<Invoice> {
        throw new Error("Method not implemented.");
    }
}