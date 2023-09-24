import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {
    constructor(private invoiceRepository: InvoiceGateway) { }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        let invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: new Address(input.street, input.number, input.complement, input.city, input.state, input.zipCode),
            items: input.items.map((item) => (
                new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price
                })
            )),
        });

        let newInvoice = await this.invoiceRepository.generate(invoice);

        return {
            id: newInvoice.id.id,
            name: newInvoice.name,
            document: newInvoice.document,
            street: newInvoice.address.street,
            number: newInvoice.address.number,
            complement: newInvoice.address.complement,
            city: newInvoice.address.city,
            state: newInvoice.address.state,
            zipCode: newInvoice.address.zipCode,
            items: newInvoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: newInvoice.getTotalPrice()
        }
    }
}