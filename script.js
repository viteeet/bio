document.addEventListener("DOMContentLoaded", () => {

  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  let toastTimeout;

  /**
   * Exibe toast de feedback acessível para o usuário
   * @param {string} message 
   */
  const showToast = (message) => {
    if (!toast || !toastText) return;
    
    toastText.textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3000);
  };

  /**
   * 1. GERADOR E DOWNLOAD DE VCARD (.VCF) COM ESTADO DE LOADING
   */
  const vcardBtn = document.getElementById("vcard-btn");

  if (vcardBtn) {
    vcardBtn.addEventListener("click", async () => {
      // Ativa estado de carregamento
      vcardBtn.classList.add("is-loading");
      vcardBtn.disabled = true;

      try {
        // Simulação curta para feedback visual tátil (300ms)
        await new Promise((resolve) => setTimeout(resolve, 300));

        const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Victor Hugo
N:Hugo;Victor;;;
ORG:Codratec Software House
TITLE:Desenvolvedor de Software & Founder
TEL;TYPE=CELL,VOICE:+5521983573881
EMAIL;TYPE=INTERNET,PREF:victor@codratec.com.br
URL:https://codratec.com.br
NOTE:Desenvolvimento de Software, Automações & Agentes de IA.
END:VCARD`;

        const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Victor_Hugo_Codratec.vcf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast("Contato baixado com sucesso!");
      } catch (err) {
        showToast("Erro ao gerar o arquivo de contato.");
      } finally {
        vcardBtn.classList.remove("is-loading");
        vcardBtn.disabled = false;
      }
    });
  }

  /**
   * 2. CÓPIA DE E-MAIL PARA ÁREA DE TRANSFERÊNCIA COM TRATAMENTO DE ERRO
   */
  document.querySelectorAll(".copy-trigger").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          showToast(`E-mail copiado: ${textToCopy}`);
        } else {
          // Fallback para navegadores sem permissão de clipboard API
          const textarea = document.createElement("textarea");
          textarea.value = textToCopy;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          showToast(`E-mail copiado: ${textToCopy}`);
        }
      } catch (err) {
        showToast("Não foi possível copiar o e-mail.");
      }
    });
  });

});
