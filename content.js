// Content script

// Sabitler
const MAX_TOTAL_TWEETS = 800; // Toplam tweet sayısı sınırı

// Sayacı başlat
let dailyTweetCount = 0; // Günlük tweet sayısı
let totalTweetCount = 0; // Toplam tweet sayısı

// Ekran üstünde gösterilecek sayaç elementi oluştur
// eğer daha önce oluşturulmamışsa
  const counterElement = createCounterElement();

// Sayaç değerlerini saklamak için chrome.storage kullanımı

// Verileri yükle ve sayacı güncelle
chrome.storage.local.get(["dailyCount", "totalCount"], (result) => {
  dailyTweetCount = result.dailyCount || 0;
  totalTweetCount = result.totalCount || 0;
  updateCounter();
});

// Sayacı güncelle ve verileri kaydet
function updateCounter() {
  dailyTweetCount++;
  totalTweetCount++;

  counterElement.textContent = `Günlük: ${dailyTweetCount} - Kalan: ${
    MAX_TOTAL_TWEETS - totalTweetCount
  }`;

  // 800 tweet sınırına yaklaşıldığında uyarı ver
  if (totalTweetCount >= MAX_TOTAL_TWEETS - 50) {
    // Son 50 tweet kala uyarı ver
    const remainingTweets = MAX_TOTAL_TWEETS - totalTweetCount;
    if (remainingTweets > 0) {
      console.log(
        `Dikkat! Toplam tweet sınırına yaklaşıyorsunuz. Kalan tweet sayısı: ${remainingTweets}`
      );
      // Burada kullanıcıya uyarı göstermek için ilgili işlemleri yapabilirsiniz.
    } else {
      // console.log("Toplam tweet sınırına ulaşıldı!");
      // Burada kullanıcıya ulaşılan sınırı bildirmek için ilgili işlemleri yapabilirsiniz.
    }
  }

  // Yeni bir gün başladığında günlük tweet sayısını sıfırla
  const now = new Date();
  if (
    now.getHours() === 0 &&
    now.getMinutes() === 0 &&
    now.getSeconds() === 0
  ) {
    dailyTweetCount = 0;
  }

  // Verileri kaydet
  chrome.storage.local.set({
    dailyCount: dailyTweetCount,
    totalCount: totalTweetCount,
  });
}

// Tweetleri saymak için bir gözlemci oluştur
const observer = new MutationObserver(() => {
  const tweetElements = document.querySelectorAll('article[role="article"]');
  if (tweetElements.length > totalTweetCount) {
    updateCounter();
  }
});

// Gözlemciyi sayfaya bağla
function connectObserver() {
  const tweetContainer = document.querySelector("main");
  if (tweetContainer) {
    observer.observe(tweetContainer, { childList: true, subtree: true });
  } else {
    setTimeout(connectObserver, 1000); // Tweet konteynırı henüz yüklenmediyse tekrar dene
  }
}

// Sayfada yüklendiğinde başlat
window.addEventListener("load", () => {
  connectObserver();
});

function createCounterElement() {
  const counterElement = document.createElement("div");
  counterElement.style.position = "fixed";
  counterElement.style.top = "10px";
  counterElement.style.right = "10px";
  counterElement.style.backgroundColor = "#1DA1F2";
  counterElement.style.color = "#fff";
  counterElement.style.padding = "4px 8px";
  counterElement.style.borderRadius = "4px";
  counterElement.style.zIndex = "9999";
  document.body.appendChild(counterElement);
  return counterElement;
}
