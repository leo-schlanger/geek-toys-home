import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";
import Footer from "@/components/Footer";
import { CLUB_PLAN_LABEL, COMPANY } from "@/lib/company";

const TermsOfUse = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <SeoHead
                title="Termos de Uso — GeekPop & Toys"
                description="Termos de uso do site e dos serviços da GeekPop & Toys."
                path="/termos"
            />
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="container max-w-4xl mx-auto glass p-8 md:p-12 rounded-2xl border border-border/50 shadow-2xl">
                    <h1 className="text-4xl font-heading font-bold mb-8 gradient-text">Termos de Uso</h1>
                    <div className="prose max-w-none space-y-6 text-muted-foreground">
                        <p className="text-sm"><strong>Última atualização:</strong> 3 de novembro de 2026</p>

                        <section className="space-y-3 bg-muted/20 p-4 rounded-lg">
                            <h2 className="text-2xl font-semibold text-foreground">Identificação</h2>
                            <p><strong>{COMPANY.legalName}</strong></p>
                            <p>Nome fantasia: <strong>{COMPANY.tradeName}</strong> (marca {COMPANY.brand})</p>
                            <p>CNPJ: {COMPANY.cnpj}</p>
                            <p>Inscrição estadual (RJ): {COMPANY.ie}</p>
                            <p>Endereço: {COMPANY.addressLine}</p>
                            <p>E-mail: <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">{COMPANY.email}</a></p>
                        </section>

                        <p>Ao utilizar os sites da <strong>GeekPop & Toys</strong> e o <strong>Clube de Vantagens</strong>, você concorda com os seguintes termos. O texto completo da loja e do clube está em <a href="https://shop.geekpoptoys.com.br/termos" className="text-primary hover:underline">shop.geekpoptoys.com.br/termos</a> e <a href="https://club.geeketoys.com.br/termos" className="text-primary hover:underline">club.geeketoys.com.br/termos</a>.</p>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">1. O Clube de Vantagens</h2>
                            <p>O Clube tem um plano único, anual, de {CLUB_PLAN_LABEL}. Os benefícios são 10% de desconto em qualquer produto (loja física e online), 50% de desconto nos ingressos dos eventos e um brinde na primeira compra da loja. Os benefícios valem apenas durante a vigência da assinatura.</p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">2. Cadastro e Segurança</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Você é responsável pela veracidade dos dados informados e pela guarda de sua senha.</li>
                                <li>O uso da conta é pessoal e intransferível.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">3. Assinaturas e Pagamentos</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>A assinatura é anual, paga à vista (PIX ou cartão). No cartão, a renovação é automática a cada 12 meses, com aviso por e-mail antes. Não há fidelidade além do período já pago.</li>
                                <li>O cancelamento interrompe a renovação futura, mas não gera estorno de períodos já pagos (salvo direito de arrependimento legal de 7 dias para novas assinaturas).</li>
                                <li>O valor pode ser reajustado, mediante comunicação prévia de 30 (trinta) dias.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">4. Uso do Site</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>É proibido o uso do site para fins ilegais ou para tentar comprometer a segurança da plataforma.</li>
                                <li>Reservamo-nos o direito de suspender contas que violem estes termos.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">5. Propriedade Intelectual</h2>
                            <p>Todo o conteúdo (logos, textos, imagens) é propriedade da GeekPop & Toys ou licenciadores parceiros.</p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">6. Foro</h2>
                            <p>Fica eleito o foro da Comarca do Rio de Janeiro - RJ para dirimir controvérsias.</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfUse;
