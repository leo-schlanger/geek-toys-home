import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="container max-w-4xl mx-auto glass p-8 md:p-12 rounded-2xl border border-border/50 shadow-2xl">
                    <h1 className="text-4xl font-heading font-bold mb-8 gradient-text">Política de Privacidade</h1>
                    <div className="prose max-w-none space-y-6 text-muted-foreground">
                        <p className="text-sm"><strong>Última atualização:</strong> Março de 2026</p>

                        <p>A <strong>GeekPop & Toys Collection</strong>, sediada em Copacabana, Rio de Janeiro - RJ, valoriza a sua privacidade. Esta política descreve como coletamos e usamos seus dados em conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">1. Dados Coletados</h2>
                            <p>Coletamos informações necessárias para a prestação de nossos serviços:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Dados de Cadastro:</strong> Nome completo, e-mail, CPF, telefone e senha (criptografada).</li>
                                <li><strong>Dados de Pagamento:</strong> Processados de forma segura por parceiros integrados (não armazenamos dados de cartão de crédito em nossos servidores).</li>
                                <li><strong>Dados de Navegação:</strong> Cookies e endereço IP para segurança e melhoria da experiência.</li>
                                <li><strong>Imagens de eventos e da loja:</strong> Fotos publicadas na galeria do site podem conter pessoas identificáveis que estiveram em eventos abertos ou na loja física.</li>
                                <li><strong>Perguntas sobre produtos:</strong> O texto da pergunta e o <strong>primeiro nome</strong> de quem perguntou ficam visíveis na página do produto, junto da nossa resposta.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">2. Finalidade do Tratamento</h2>
                            <p>Seus dados são utilizados para:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Gestão da assinatura do "Clube de Vantagens".</li>
                                <li>Processamento de pagamentos.</li>
                                <li>Comunicação sobre pedidos, novidades e suporte.</li>
                                <li>Cumprimento de obrigações legais.</li>
                                <li>Divulgação institucional da loja e dos eventos, por meio da galeria de fotos.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">Uso de imagem na galeria</h2>
                            <p>
                                As fotos da galeria são registradas em eventos abertos ao público e na loja física, e
                                publicadas para divulgar a marca. Elas não são vendidas nem cedidas a terceiros, e o
                                site não oferece download.
                            </p>
                            <p>
                                Se você aparece em alguma foto e não quer que ela continue publicada, escreva para{" "}
                                <a href="mailto:contato@geeketoys.com.br" className="text-primary hover:underline">
                                    contato@geeketoys.com.br
                                </a>{" "}
                                indicando o álbum e a foto. A remoção é feita sem que você precise justificar o
                                pedido.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">Perguntas públicas nos produtos</h2>
                            <p>
                                Perguntas feitas na página de um produto ficam visíveis para outros clientes assim que
                                enviadas, identificadas apenas pelo <strong>primeiro nome</strong> — nunca pelo nome
                                completo, e-mail ou telefone. Por isso, não inclua dados pessoais no texto da
                                pergunta.
                            </p>
                            <p>
                                Você pode pedir a remoção de uma pergunta a qualquer momento pelo e-mail de contato. Ao
                                excluir a conta, o texto das suas perguntas é anonimizado e some da vitrine.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">3. Direitos do Titular (LGPD)</h2>
                            <p>Você tem o direito de:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Confirmar a existência de tratamento de dados.</li>
                                <li>Acessar, corrigir ou excluir seus dados.</li>
                                <li>Revogar consentimento a qualquer momento.</li>
                                <li>Portabilidade dos dados.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">4. Compartilhamento de Dados</h2>
                            <p>Não vendemos seus dados. Compartilhamos apenas com:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Processadores de pagamento.</li>
                                <li>Serviços de hospedagem e infraestrutura de TI.</li>
                                <li>Autoridades judiciais, se solicitado por lei.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold text-foreground">5. Contato</h2>
                            <p>Para questões sobre seus dados: <a href="mailto:contato@geeketoys.com.br" className="text-primary hover:underline">contato@geeketoys.com.br</a></p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
