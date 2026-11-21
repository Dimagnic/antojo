import Script from "next/script";

// Burbuja de chat del asistente de Antojo (ClienteAI)
export function ClienteAIWidget() {
  return <Script src="https://clienteai.site/widget.js" data-token="ltf6px0k7s84f2bo" strategy="afterInteractive" />;
}
