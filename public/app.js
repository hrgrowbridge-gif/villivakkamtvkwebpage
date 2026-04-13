const countdownElement = document.getElementById('countdown');
const targetDate = new Date('2026-04-23T10:00:00');
const slides = document.getElementById('slides');
const slideImages = slides ? slides.querySelectorAll('img') : [];
let currentSlide = 0;

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    countdownElement.textContent = 'IT&apos;S TIME';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownElement.textContent = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function moveSlide(index) {
  currentSlide = (index + slideImages.length) % slideImages.length;
  const offset = -currentSlide * 100;
  slides.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  moveSlide(currentSlide + 1);
}

function prevSlide() {
  moveSlide(currentSlide - 1);
}

if (document.getElementById('nextBtn')) {
  document.getElementById('nextBtn').addEventListener('click', nextSlide);
}
if (document.getElementById('prevBtn')) {
  document.getElementById('prevBtn').addEventListener('click', prevSlide);
}

setInterval(() => {
  nextSlide();
}, 5000);

if (countdownElement) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

const issueForm = document.getElementById('issueForm');
const formMessage = document.getElementById('formMessage');

if (issueForm) {
  issueForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formMessage.textContent = '';
    const formData = new FormData(issueForm);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit form');
      }

      issueForm.reset();
      formMessage.textContent = result.message || 'Issue submitted successfully.';
      formMessage.style.color = '#ffeb99';
    } catch (error) {
      formMessage.textContent = error.message || 'Submission failed.';
      formMessage.style.color = '#ff7c7c';
    }
  });
}

const langButtons = document.querySelectorAll('.lang-btn');
const i18nElements = document.querySelectorAll('[data-i18n]');
const optionElements = document.querySelectorAll('option[data-i18n]');

const translations = {
  en: {
    pageTitle: 'Tamilaga Vettri Kazhagam | Makkal Kuraigal Thirkum Maiyam',
    metaDescription: 'Tamilaga Vettri Kazhagam campaign website for Aadhav Arjuna in Villivakkam with manifesto, countdown, gallery and issue submission.',
    brandName: 'Tamilaga Vettri Kazhagam',
    brandSubtitle: 'Makkal Kuraigal Thirkum Maiyam',
    navManifesto: 'Manifesto',
    navGallery: 'Gallery',
    navHelpDesk: 'Help Desk',
    eyebrow: 'Tamilaga Vettri Kazhagam Whistle Movement',
    heroHeading: 'Aadhav Arjuna for Villivakkam',
    heroText: 'A people-first campaign for Makkal Kuraigal Thirkum Maiyam with solid red and yellow resolve, professional delivery, and real issue response.',
    whistleLabel: 'Whistle Symbol',
    voteDate: 'April 23 2026',
    manifestoLabel: 'Manifesto 2026',
    manifestoHeading: 'Tamilaga Vettri Kazhagam promises for people, peace, and progress',
    whyHeading: 'Why Tamilaga Vettri Kazhagam in Villivakkam?',
    whyText: 'For too long, promises have stayed on paper. Tamilaga Vettri Kazhagam brings real accountability, direct delivery, and a people-first council to solve the issues that matter most.',
    promiseHeading: 'Tamilaga Vettri Kazhagam\'s promise',
    promiseText: 'Every vote is a pledge that your issue will be heard. Tamilaga Vettri Kazhagam builds a people\'s desk for Villivakkam and creates a permanent channel between residents and leadership.',
    galleryLabel: 'Tamilaga Vettri Kazhagam Gallery',
    galleryHeading: 'People, campaigns, and change in motion',
    issueCopy: 'Tell us your name, ward, address, and the most important issue you face. This report is saved securely and only accessible to Tamilaga Vettri Kazhagam admin.',
    submitIssueLabel: 'Submit Your Issue',
    issueHeading: 'Makkal Kuraigal Thirkum Maiyam Issue Form',
    labelName: 'Name',
    labelArea: 'Area',
    labelWard: 'Ward',
    labelAddress: 'Address',
    labelPhone: 'Phone Number',
    labelEmail: 'Email ID',
    labelAge: 'Age',
    labelIssueType: 'Issue Type',
    labelIssue: 'What is the issue?',
    labelAdditional: 'Additional details',
    labelAttachment: 'Supporting file',
    submitButton: 'Submit Issue',
    footerTitle: 'Tamilaga Vettri Kazhagam | Villivakkam',
    footerText: 'Aadhav Arjuna — Makkal Kuraigal Thirkum Maiyam.',
    footerSymbol: 'Voting symbol:'
  },
  ta: {
    pageTitle: 'தமிழக வெற்றி கழகம் | மக்கல் குறைகள் திருக்கும் மையம்',
    metaDescription: 'விள்ளிவாக்கம் ஆதவ் அர்ஜுனாவுக்கான தமிழக வெற்றி கழகம் பிரச்சாரம், மனிபெஸ்டோ, கணக்கோட்டை, காட்சி மற்றும் சிக்கல் சமர்ப்பிப்பு.',
    brandName: 'தமிழக வெற்றி கழகம்',
    brandSubtitle: 'மக்கள் குறைகள் திருக்கும் மையம்',
    navManifesto: 'மனிபெஸ்டோ',
    navGallery: 'கேலரி',
    navHelpDesk: 'அரசு உதவி',
    eyebrow: 'தமிழக வெற்றி கழகம் விசில் இயக்கம்',
    heroHeading: 'விள்ளிவாக்கம் - ஆதவ் அர்ஜுநா',
    heroText: 'திடமான சிவப்பு மற்றும் மஞ்சள் உறுதிப்பாடுகளுடன் மக்களின் பிரச்சனைகளை தீர்க்கும் தொழில்முறை இயக்கம்.',
    whistleLabel: 'விசில் சின்னம்',
    voteDate: '23 ஏப்ரல் 2026',
    manifestoLabel: 'மனிபெஸ்டோ 2026',
    manifestoHeading: 'மக்களுக்கு, அமைதிக்கு, முன்னேற்றத்திற்கு தமிழக வெற்றி கழகம் உறுதிமொழிகள்',
    whyHeading: 'என் தமிழக வெற்றி கழகம் விள்ளிவாக்கத்தில்?',
    whyText: 'நீண்ட காலமாக வாக்குறுதிகள் காகிதத்தில் மட்டும் இருந்தது. தமிழகம் வெற்றி கழகம் உண்மையான கணக்கின்மை, நேரடி டெலிவரி மற்றும் மக்கள் முன்னுரிமையை கொண்டு வருகிறது.',
    promiseHeading: 'தமிழக வெற்றி கழகத்தின் வாக்குறுதி',
    promiseText: 'ஒவ்வொரு வாக்கும் உங்கள் பிரச்சனை கேட்கப்படும் என்பதற்கான உறுதியாகும். தமிழகம் வெற்றி கழகம் விள்ளிவாக்கத்திற்கு மக்கள் மேசையை உருவாக்குகிறது.',
    galleryLabel: 'தமிழக வெற்றி கழகம் கேலரி',
    galleryHeading: 'மக்கள், பிரச்சாரங்கள் மற்றும் மாற்றம் இயக்கத்தில்',
    issueCopy: 'உங்கள் பெயர், வார்டு, முகவரி மற்றும் நீங்கள் சந்திக்கும் முக்கிய பிரச்சனையை எங்களுக்குச் சொல்லுங்கள். இந்தப் பதிவு பாதுகாப்பாக சேமிக்கப்படும் மற்றும் தமிழக வெற்றி கழகம் நிர்வாகத்திற்கே கிடைக்கும்.',
    submitIssueLabel: 'உங்கள் பிரச்சனையை சமர்ப்பிக்கவும்',
    issueHeading: 'மக்கள் குறைகள் திருக்கும் மையம் பிரச்சனை படிவம்',
    labelName: 'பெயர்',
    labelArea: 'பகுதி',
    labelWard: 'வார்டு',
    labelAddress: 'முகவரி',
    labelPhone: 'தொலைபேசி எண்',
    labelEmail: 'மின்னஞ்சல் ஐடி',
    labelAge: 'வயது',
    labelIssueType: 'பிரச்சனை வகை',
    labelIssue: 'பிரச்சனை என்ன?',
    labelAdditional: 'மேலும் விவரங்கள்',
    labelAttachment: 'ஆதரக கோப்பு',
    submitButton: 'சமர்ப்பிக்க',
    footerTitle: 'தமிழக வெற்றி கழகம் | விள்ளிவாக்கம்',
    footerText: 'ஆதவ் அர்ஜுனா — மக்கள் குறைகள் திருக்கும் மையம்.',
    footerSymbol: 'வாக்குச்சீட்டு சின்னம்:'
  }
};

function applyLanguage(lang) {
  i18nElements.forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const value = translations[lang][key];
    if (value) {
      el.textContent = value;
    }
  });

  optionElements.forEach((option) => {
    const key = option.dataset.i18n;
    if (!key) return;
    const value = translations[lang][key];
    if (value) {
      option.textContent = value;
    }
  });

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = translations[lang].metaDescription || metaDesc.content;
  }
  document.title = translations[lang].pageTitle || document.title;

  langButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });
  localStorage.setItem('siteLanguage', lang);
}

langButtons.forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});

const savedLanguage = localStorage.getItem('siteLanguage') || 'en';
applyLanguage(savedLanguage);
