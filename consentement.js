
(function () {
  const GA_ID = 'G-97YL91NRQN';
  const STORAGE_KEY = 'fabrique_consentement_analytics';

  function chargerAnalytics() {
    if (window.fabriqueAnalyticsCharge) return;
    window.fabriqueAnalyticsCharge = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
  }

  function enregistrer(choix) {
  localStorage.setItem(STORAGE_KEY, choix);
  window.location.reload();
}

  function afficherBanniere() {
    if (document.getElementById('fabrique-consentement')) return;

    const style = document.createElement('style');
    style.textContent = `
      #fabrique-consentement {
        position: fixed;
        z-index: 99999;
        left: 16px;
        right: 16px;
        bottom: 14px;
        max-width: 680px;
        margin: auto;
        padding: 14px 18px;
        background: #fffdf7;
        color: #263746;
        border: 1px solid #e5dfd2;
        border-radius: 10px;
        box-shadow: 0 3px 18px rgba(0,0,0,.12);
        font: 14px/1.45 system-ui, sans-serif;
      }
      #fabrique-consentement p { margin: 5px 0 10px; }
      #fabrique-consentement .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
      }
      #fabrique-consentement button {
        border: 0;
        background: none;
        color: #263746;
        padding: 5px 0;
        font: inherit;
        font-weight: 600;
        text-decoration: underline;
        cursor: pointer;
      }
      #fabrique-consentement button:focus-visible {
        outline: 2px solid #d9a900;
        outline-offset: 3px;
      }
      #fabrique-consentement .details {
        display: none;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #e5dfd2;
      }
      #fabrique-consentement .details.visible { display: block; }
      #fabrique-gestion-cookies {
        position: fixed;
        z-index: 99998;
        bottom: 8px;
        left: 8px;
        border: 1px solid #e5dfd2;
        border-radius: 5px;
        background: #fffdf7;
        color: #263746;
        padding: 5px 9px;
        font: 12px system-ui, sans-serif;
        cursor: pointer;
      }
      @media (max-width: 520px) {
        #fabrique-consentement { left: 8px; right: 8px; bottom: 8px; }
        #fabrique-consentement .actions { gap: 12px; }
      }
    `;
    document.head.appendChild(style);

    const bandeau = document.createElement('div');
    bandeau.id = 'fabrique-consentement';
    bandeau.innerHTML = `
      <strong>Votre confidentialité</strong>
      <p>Nous utilisons des cookies de mesure d'audience pour mieux connaître la fréquentation du site. Vous êtes libre de les accepter ou de les refuser.</p>
      <div class="actions">
        <button type="button" id="fabrique-accepter">Accepter</button>
        <button type="button" id="fabrique-refuser">Refuser</button>
        <button type="button" id="fabrique-personnaliser">Personnaliser</button>
      </div>
      <div class="details" id="fabrique-details">
        <label>
          <input type="checkbox" id="fabrique-analytics">
          Autoriser les statistiques Google Analytics
        </label>
        <button type="button" id="fabrique-enregistrer">Enregistrer mon choix</button>
      </div>
    `;
    document.body.appendChild(bandeau);

    document.getElementById('fabrique-accepter').onclick = () => enregistrer('oui');
    document.getElementById('fabrique-refuser').onclick = () => enregistrer('non');

    document.getElementById('fabrique-personnaliser').onclick = () => {
      document.getElementById('fabrique-details').classList.toggle('visible');
    };

    document.getElementById('fabrique-enregistrer').onclick = () => {
      const autorise = document.getElementById('fabrique-analytics').checked;
      enregistrer(autorise ? 'oui' : 'non');
    };
  }

  function initialiser() {
    const choix = localStorage.getItem(STORAGE_KEY);

    if (choix === 'oui') {
      chargerAnalytics();
    } else if (choix !== 'non') {
      afficherBanniere();
    }

    const lien = document.createElement('button');
    lien.id = 'fabrique-gestion-cookies';
    lien.type = 'button';
    lien.textContent = 'Gestion des cookies';
    lien.onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    };
    document.body.appendChild(lien);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiser);
  } else {
    initialiser();
  }
})();
