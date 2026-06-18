import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const ADMIN_NUMBERS = {
  "05370530916": "Sanay",
  "905552222222": "Made Dreams Admin",
};

const DEFAULT_PRODUCT_CATEGORIES = [
  "Tişört",
  "Ayakkabı",
  "Çanta",
  "Kırlent",
  "Tuval",
  "Şort",
  "Hoodie",
];



const PRODUCT_CATEGORY_ICONS = {
  Tümü: "✨",
  Tişört: "👕",
  Ayakkabı: "👟",
  Çanta: "👜",
  Kırlent: "🛋️",
  Tuval: "🎨",
  Şort: "🩳",
  Hoodie: "🧥",
};

const DESIGN_CATEGORY_ICONS = {
  Tümü: "🌈",
  Spor: "⚽",
  Fantastik: "🦄",
  "Çizgi Film": "🧸",
  Aile: "👨‍👩‍👧",
  Hayvanlar: "🐾",
  Manzara: "🏞️",
  "Kişiye Özel": "📸",
};

const DEFAULT_DESIGN_CATEGORIES = [
  "Spor",
  "Fantastik",
  "Çizgi Film",
  "Aile",
  "Hayvanlar",
  "Manzara",
  "Kişiye Özel",
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Pet Portrait Tuval Seti",
    price: 749,
    productCategory: "Tuval",
    designCategory: "Hayvanlar",
    image: "/images/sample1.png",
  },
  {
    id: 2,
    name: "Türkiye Forma Boyama Seti",
    price: 899,
    productCategory: "Tişört",
    designCategory: "Spor",
    image: "/images/sample2.png",
  },
  {
    id: 3,
    name: "Çocuk Kahraman Tişört Seti",
    price: 649,
    productCategory: "Tişört",
    designCategory: "Çizgi Film",
    image: "/images/sample3.png",
  },
];

const DEFAULT_ARTICLES = [
  {
    id: 1,
    title: "Paint by Numbers Nedir?",
    category: "Rehber",
    excerpt:
      "Sayılarla boyama setleri nasıl çalışır, kimler için uygundur ve neden kişiye özel hediyelerde popülerdir?",
    content:
      "Paint by Numbers, yani sayılarla boyama, her alanın bir numara ile işaretlendiği ve bu numaralara göre renklerin uygulandığı yaratıcı bir deneyimdir. Made Dreams bu fikri kişiye özel ürünlerle birleştirir. Kullanıcı hazır tasarımlardan seçim yapabilir veya kendi fotoğrafını yükleyerek özel bir boyama seti oluşturabilir. Bu sistem özellikle hediye, aile anıları, evcil hayvan portreleri ve kişisel tasarımlar için oldukça ilgi çekicidir.",
    image: "/images/sample1.png",
    readTime: "4 dk",
    createdAt: "Bugün",
  },
  {
    id: 2,
    title: "Kendi Fotoğrafından Özel Tasarım",
    category: "Custom Upload",
    excerpt:
      "Fotoğrafını yükleyerek tişört, çanta, tuval veya kırlent üzerinde nasıl özel bir tasarım oluşturabilirsin?",
    content:
      "Made Dreams üzerinde kullanıcı kendi görselini yükleyebilir ve bu görseli tişört, ayakkabı, çanta, kırlent, tuval veya hoodie gibi ürünlerle eşleştirebilir. Bu süreç tamamen kişiselleştirilmiş bir sipariş deneyimi sunar. Müşteri görselini seçer, ürün tipini belirler, notunu ekler ve demo sipariş oluşturur. Admin panelinde bu sipariş görseli, kategori bilgisi, müşteri adı ve sipariş durumu ile birlikte görüntülenir.",
    image: "/images/sample2.png",
    readTime: "3 dk",
    createdAt: "Demo",
  },
  {
    id: 3,
    title: "En Güzel Hediye Fikirleri",
    category: "Hediye",
    excerpt:
      "Aile, arkadaş, çocuk ve evcil hayvan temalı kişiye özel boyama ürünleri için ilham veren fikirler.",
    content:
      "Kişiye özel boyama setleri, klasik hediyelerden farklı olarak hem duygusal hem de yaratıcı bir deneyim sunar. Aile fotoğrafları, evcil hayvan portreleri, çocuk temalı çizimler veya özel gün hatıraları Made Dreams ürünlerine uygulanabilir. Böylece hediye sadece bir ürün değil, aynı zamanda kişisel bir anıya dönüşür.",
    image: "/images/sample3.png",
    readTime: "5 dk",
    createdAt: "Demo",
  },
];

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error("LocalStorage parse error:", error);
    localStorage.removeItem(key);
    return fallback;
  }
}

function getCustomOrderPrice(productCategory) {
  const prices = {
    Tişört: 649,
    Ayakkabı: 999,
    Çanta: 799,
    Kırlent: 549,
    Tuval: 749,
    Şort: 599,
    Hoodie: 899,
  };

  

  return prices[productCategory] || 650;
}

/*Big App*/

export default function App() {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [activeProductFilter, setActiveProductFilter] = useState("Tümü");
  const [activeDesignFilter, setActiveDesignFilter] = useState("Tümü");
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [loginName, setLoginName] = useState("");
  const [loginMode, setLoginMode] = useState("user");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [categoryPage, setCategoryPage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerTimerRef = useRef(null);

const [articles, setArticles] = useState(() =>
  loadFromStorage("madeDreamsArticles", DEFAULT_ARTICLES)
);

const [articleForm, setArticleForm] = useState({
  title: "",
  category: "",
  excerpt: "",
  content: "",
  image: "/images/sample1.png",
  readTime: "3 dk",
});
  const [productCategories, setProductCategories] = useState(() =>
  loadFromStorage("madeDreamsProductCategories", DEFAULT_PRODUCT_CATEGORIES)
);

const [designCategories, setDesignCategories] = useState(() =>
  loadFromStorage("madeDreamsDesignCategories", DEFAULT_DESIGN_CATEGORIES)
);

const [products, setProducts] = useState(() =>
  loadFromStorage("madeDreamsProducts", DEFAULT_PRODUCTS)
);

const [newProductCategory, setNewProductCategory] = useState("");
const [newDesignCategory, setNewDesignCategory] = useState("");

const [productForm, setProductForm] = useState({
  name: "",
  price: "",
  productCategory: "Tişört",
  designCategory: "Spor",
  image: "/images/sample1.png",
});

  const [selectedProduct, setSelectedProduct] = useState("Tişört");
  const [selectedDesign, setSelectedDesign] = useState("Kişiye Özel");
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

const [cart, setCart] = useState(() =>
  loadFromStorage("madeDreamsCart", [])
);

const [orders, setOrders] = useState(() =>
  loadFromStorage("madeDreamsOrders", [])
);

useEffect(() => {
  localStorage.setItem("madeDreamsArticles", JSON.stringify(articles));
}, [articles]);

  useEffect(() => {
    localStorage.setItem("madeDreamsOrders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("madeDreamsCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
  localStorage.setItem(
    "madeDreamsProductCategories",
    JSON.stringify(productCategories)
  );
}, [productCategories]);

useEffect(() => {
  localStorage.setItem(
    "madeDreamsDesignCategories",
    JSON.stringify(designCategories)
  );
}, [designCategories]);

useEffect(() => {
  localStorage.setItem("madeDreamsProducts", JSON.stringify(products));
}, [products]);

  const isAdmin = user?.role === "admin";

  const filteredProducts = useMemo(() => {
  return products.filter((product) => {
    const productMatch =
      activeProductFilter === "Tümü" ||
      product.productCategory === activeProductFilter;

    const designMatch =
      activeDesignFilter === "Tümü" ||
      product.designCategory === activeDesignFilter;

    return productMatch && designMatch;
  });
}, [products, activeProductFilter, activeDesignFilter]);

const cartTotal = useMemo(() => {
  return cart.reduce((total, item) => total + Number(item.price || 0), 0);
}, [cart]);

const ordersTotal = useMemo(() => {
  return orders.reduce((total, item) => total + Number(item.price || 0), 0);
}, [orders]);

const grandTotal = cartTotal + ordersTotal;

const selectedArticle = useMemo(() => {
  return articles.find((article) => article.id === selectedArticleId);
}, [articles, selectedArticleId]);

const categoryPageProducts = useMemo(() => {
  if (!categoryPage) return [];

  if (categoryPage.name === "Tümü") {
    return products;
  }

  if (categoryPage.type === "product") {
    return products.filter(
      (product) => product.productCategory === categoryPage.name
    );
  }

  if (categoryPage.type === "design") {
    return products.filter(
      (product) => product.designCategory === categoryPage.name
    );
  }

  return [];
}, [products, categoryPage]);

useEffect(() => {
  const elements = document.querySelectorAll(
".motion-strip, .motion-card, .articles-section, .article-card, .category-detail-page, .category-detail-hero, .about-section, .why-section, .faq-section, .contact-section, .why-card, .faq-item, .section-block, .upload-section, .admin-section, .cart-section, .category, .design-card, .product-card, .manager-card, .order-card, .cart-row");
  elements.forEach((element) => {
    element.classList.add("reveal-item");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  elements.forEach((element) => observer.observe(element));

  return () => observer.disconnect();

}, [page, products, orders, cart, productCategories, designCategories, articles, categoryPage]);

function getProductCategoryCount(category) {
  if (category === "Tümü") return products.length;

  return products.filter(
    (product) => product.productCategory === category
  ).length;
}

function getDesignCategoryCount(category) {
  if (category === "Tümü") return products.length;

  return products.filter(
    (product) => product.designCategory === category
  ).length;
}


function clearFilters() {
  setActiveProductFilter("Tümü");
  setActiveDesignFilter("Tümü");
}

 function openLoginModal(mode) {
  setLoginMode(mode);
  setShowLoginModal(true);
}

function closeLoginModal() {
  setShowLoginModal(false);
  setPhone("");
  setLoginName("");
  setLoginMode("user");
}

function login() {
  const cleanPhone = phone.trim().replaceAll(" ", "");

  if (!cleanPhone) {
    alert("Telefon numarası gir.");
    return;
  }

  const adminName = ADMIN_NUMBERS[cleanPhone];

  if (loginMode === "admin" && !adminName) {
    alert("Bu numara admin olarak kayıtlı değil.");
    return;
  }

  if (adminName) {
    setUser({
      name: adminName,
      phone: cleanPhone,
      role: "admin",
    });

    setPage("home");
    setShowLoginModal(false);
    return;
  }

  if (!loginName.trim()) {
    alert("Lütfen adını gir.");
    return;
  }

  setUser({
    name: loginName.trim(),
    phone: cleanPhone,
    role: "user",
  });

  setPage("home");
  setShowLoginModal(false);
}

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setUploadedImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function createCustomOrder() {
    if (!uploadedImage) {
      alert("Lütfen bir görsel yükle.");
      return;
    }

    const newOrder = {
      id: Date.now(),
      customerName: customerName || user?.name || "Demo Kullanıcı",
      phone: user?.phone || phone || "Demo",
      productCategory: selectedProduct,
      designCategory: selectedDesign,
      price: getCustomOrderPrice(selectedProduct),
      note,
      image: uploadedImage,
      status: "Pending",
      createdAt: new Date().toLocaleString("tr-TR"),
};

    setOrders([newOrder, ...orders]);

    setCustomerName("");
    setNote("");
    setUploadedImage("");

    alert("Özel tasarım siparişi oluşturuldu.");
  }

  function addToCart(product) {
    setCart([...cart, product]);
    alert("Ürün sepete eklendi.");
  }

  function updateOrderStatus(orderId, status) {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }

function removeFromCart(indexToRemove) {
  setCart(cart.filter((_, index) => index !== indexToRemove));
}

function clearCart() {
  setCart([]);
}


  function clearDemoData() {
    localStorage.removeItem("madeDreamsOrders");
    localStorage.removeItem("madeDreamsCart");
    setOrders([]);
    setCart([]);
  }

  function addProductCategory() {
  const value = newProductCategory.trim();

  if (!value) return;
  if (productCategories.includes(value)) {
    alert("Bu kategori zaten var.");
    return;
  }

  setProductCategories([...productCategories, value]);
  setNewProductCategory("");
}

function removeProductCategory(category) {
  setProductCategories(productCategories.filter((item) => item !== category));
}

function addDesignCategory() {
  const value = newDesignCategory.trim();

  if (!value) return;
  if (designCategories.includes(value)) {
    alert("Bu kategori zaten var.");
    return;
  }

  setDesignCategories([...designCategories, value]);
  setNewDesignCategory("");
}

function removeDesignCategory(category) {
  setDesignCategories(designCategories.filter((item) => item !== category));
}

function addAdminProduct() {
  if (!productForm.name || !productForm.price) {
    alert("Ürün adı ve fiyat gir.");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name: productForm.name,
    price: Number(productForm.price),
    productCategory: productForm.productCategory,
    designCategory: productForm.designCategory,
    image: productForm.image || "/images/sample1.png",
  };

  setProducts([newProduct, ...products]);

  setProductForm({
    name: "",
    price: "",
    productCategory: productCategories[0] || "Tişört",
    designCategory: designCategories[0] || "Spor",
    image: "/images/sample1.png",
  });
}

function removeProduct(productId) {
  setProducts(products.filter((product) => product.id !== productId));
}

function addArticle() {
  if (!articleForm.title || !articleForm.excerpt) {
    alert("Makale başlığı ve kısa açıklama gir.");
    return;
  }

  const newArticle = {
    id: Date.now(),
    title: articleForm.title,
    category: articleForm.category || "Made Dreams",
    excerpt: articleForm.excerpt,
    content: articleForm.content || articleForm.excerpt,
    image: articleForm.image || "/images/sample1.png",
    readTime: articleForm.readTime || "3 dk",
    createdAt: new Date().toLocaleDateString("tr-TR"),
  };
  

  setArticles([newArticle, ...articles]);

setArticleForm({
  title: "",
  category: "",
  excerpt: "",
  content: "",
  image: "/images/sample1.png",
  readTime: "3 dk",
});
}

function removeArticle(articleId) {
  setArticles(articles.filter((article) => article.id !== articleId));
}

function openArticle(articleId) {
  setSelectedArticleId(articleId);
  setPage("article");

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 50);
}

useEffect(() => {
  function handleScroll() {
    setShowBackTop(window.scrollY > 500);
  }

  handleScroll();

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function handleAdminProductImageUpload(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setProductForm({
      ...productForm,
      image: reader.result,
    });
  };

  reader.readAsDataURL(file);
}

function handleAdminArticleImageUpload(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setArticleForm({
      ...articleForm,
      image: reader.result,
    });
  };

  reader.readAsDataURL(file);
}

function openCategoryPage(type, category) {
  setCategoryPage({
    type,
    name: category,
  });

  if (type === "product") {
    setActiveProductFilter(category);
    setActiveDesignFilter("Tümü");
  }

  if (type === "design") {
    setActiveDesignFilter(category);
    setActiveProductFilter("Tümü");
  }

  setPage("category");

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 50);
}

function goToPage(nextPage) {
  setPage(nextPage);
  setMenuOpen(false);

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 50);
}

function goToHomeSection(sectionId) {
  setPage("home");
  setMenuOpen(false);

  setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 80);
}

useEffect(() => {
  function showHeaderTemporarily() {
    setHeaderVisible(true);

    if (headerTimerRef.current) {
      clearTimeout(headerTimerRef.current);
    }

    headerTimerRef.current = setTimeout(() => {
      const isTopOfPage = window.scrollY < 120;

      if (!isTopOfPage && !menuOpen && !showLoginModal) {
        setHeaderVisible(false);
      }
    }, 1800);
  }

  function handleScroll() {
    const isTopOfPage = window.scrollY < 120;

    if (isTopOfPage) {
      setHeaderVisible(true);

      if (headerTimerRef.current) {
        clearTimeout(headerTimerRef.current);
      }

      return;
    }

    showHeaderTemporarily();
  }

  function handleMouseMove(event) {
    if (event.clientY < 90) {
      showHeaderTemporarily();
    }
  }

  // موقع باز شدن سایت
  if (window.scrollY < 120) {
    setHeaderVisible(true);
  } else {
    showHeaderTemporarily();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("mousemove", handleMouseMove);

    if (headerTimerRef.current) {
      clearTimeout(headerTimerRef.current);
    }
  };
}, [menuOpen, showLoginModal]);

/*Big Return*/

  return (
    <main>
    <header
  className={`site-header ${
    headerVisible || menuOpen || showLoginModal
      ? "header-visible"
      : "header-hidden"
  }`}
>
  <div className="header-inner">
    <button
      className="brand brand-button"
      onClick={() => goToPage("home")}
    >
      <img src="/images/logo.png" alt="Made Dreams Logo" />
      <div>
        <strong>Made Dreams</strong>
        <span>Paint your own world</span>
      </div>
    </button>

    <div className="header-right">
      <button className="header-cart-button" onClick={() => goToPage("cart")}>
        🛒 Sepet ({cart.length})
      </button>

      {!user ? (
        <button
          className="header-login-button"
          onClick={() => openLoginModal("user")}
        >
          Giriş
        </button>
      ) : (
        <div className="user-pill">
          Hoş geldin, <b>{user.name}</b>
          <button
            className="logout-button"
            onClick={() => {
              setUser(null);
              goToPage("home");
            }}
          >
            Çıkış
          </button>
        </div>
      )}

      <button className="menu-toggle" onClick={() => setMenuOpen(true)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>

  {menuOpen && (
    <div className="side-menu-backdrop" onClick={() => setMenuOpen(false)}>
      <aside className="side-menu" onClick={(event) => event.stopPropagation()}>
        <div className="side-menu-head">
          <div>
            <span>Made Dreams</span>
            <h3>Menü</h3>
          </div>

          <button onClick={() => setMenuOpen(false)}>×</button>
        </div>

        <div className="side-menu-list">
          <button onClick={() => goToPage("home")}>🏠 Ana Sayfa</button>
          <button onClick={() => goToHomeSection("products")}>🛍️ Ürünler</button>
          <button onClick={() => goToPage("upload")}>🎨 Tasarım Yükle</button>
          <button onClick={() => goToHomeSection("articles")}>📰 Makaleler</button>
          <button onClick={() => goToHomeSection("about")}>✨ Hakkımızda</button>
          <button onClick={() => goToHomeSection("faq")}>❓ SSS</button>
          <button onClick={() => goToHomeSection("contact")}>📩 İletişim</button>
          <button onClick={() => goToPage("cart")}>🛒 Sepet ({cart.length})</button>

          {!user && (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openLoginModal("user");
                }}
              >
                👤 Kullanıcı Girişi
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  openLoginModal("admin");
                }}
              >
                🔐 Admin Login
              </button>
            </>
          )}

          {isAdmin && (
            <button onClick={() => goToPage("admin")}>⚙️ Admin Panel</button>
          )}
        </div>

        <div className="side-menu-footer">
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">
            📷 Instagram
          </a>
        </div>
      </aside>
    </div>
  )}
</header>

{showLoginModal && (
  <div className="login-modal-backdrop">
    <div className="login-modal">
      <button className="modal-close" onClick={closeLoginModal}>×</button>

      <span className="modal-badge">
        {loginMode === "admin" ? "Admin Login" : "User Login"}
      </span>

      <h2>
        {loginMode === "admin" ? "Admin olarak giriş yap" : "Siteye giriş yap"}
      </h2>

      <p>
        {loginMode === "admin"
          ? "Admin paneline erişmek için kayıtlı admin numarasını gir."
          : "Adını ve telefon numaranı gir, site seni isminle karşılasın."}
      </p>

      {loginMode === "user" && (
        <input
          value={loginName}
          onChange={(event) => setLoginName(event.target.value)}
          placeholder="Adın"
        />
      )}

      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="Telefon numarası"
      />

      <button className="modal-login-button" onClick={login}>
        Giriş Yap
      </button>
    </div>
  </div>
)}
    

{page === "home" && (
  <>
      <section id="home" className="hero-section">
        <div className="hero-text">
          <div className="badge">Türkiye için özel demo site</div>
          <h1>Kendi Renkli Dünyanı Tasarla</h1>
          <p>
            Sevdiğin tasarımı seç, ürününü belirle, kendi görselini yükle ve
            Made Dreams ile kişiye özel boyama setini oluştur.
          </p>

          <div className="hero-actions">
         <button className="dark-button" onClick={() => goToHomeSection("products")}>
  Tasarımları Keşfet
</button>

<button className="mint-button" onClick={() => goToPage("upload")}>
  Görsel Yükle
</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="blob blob-yellow"></div>
          <div className="blob blob-pink"></div>
          <div className="logo-card">
            <img src="/images/logo.png" alt="Made Dreams" />
          </div>
        </div>
      </section>

<section className="motion-strip">
  <div className="motion-layout">
    <div className="motion-copy">
      <span className="motion-label">Made Dreams deneyimi</span>
      <h2>Seç, yükle, tasarla ve renklendir.</h2>
      <p>
        Hazır tasarımlardan seçebilir veya kendi fotoğrafını yükleyerek
        tişört, ayakkabı, çanta, kırlent ve tuval üzerinde kişiye özel
        boyama seti oluşturabilirsin.
      </p>
    </div>

    <div className="motion-preview">
      <div className="preview-bubble bubble-one">🎨</div>
      <div className="preview-bubble bubble-two">👕</div>
      <div className="preview-bubble bubble-three">📸</div>

      <div className="mini-product-card">
        <img src="/images/logo.png" alt="Made Dreams" />
        <div>
          <b>Custom Design</b>
          <small>Upload • Choose • Create</small>
        </div>
      </div>
    </div>
  </div>

  <div className="motion-grid">
    <div className="motion-card">
      <strong>01</strong>
      <h3>Tasarımı Seç</h3>
      <p>Hazır tasarımlardan birini seç veya kendi görselini yükle.</p>
    </div>

    <div className="motion-card">
      <strong>02</strong>
      <h3>Ürünü Belirle</h3>
      <p>Tişört, ayakkabı, çanta, kırlent, tuval veya hoodie seç.</p>
    </div>

    <div className="motion-card">
      <strong>03</strong>
      <h3>Demo Sipariş Oluştur</h3>
      <p>Siparişin admin panelinde görünsün ve durumunu takip et.</p>
    </div>
  </div>

  <div className="marquee">
    <div className="marquee-track">
      <span>Custom Upload</span>
      <span>Paint by Numbers</span>
      <span>Made in Türkiye</span>
      <span>TRY ₺</span>
      <span>Family Gifts</span>
      <span>Pet Portraits</span>
      <span>Custom Upload</span>
      <span>Paint by Numbers</span>
      <span>Made in Türkiye</span>
      <span>TRY ₺</span>
    </div>
  </div>
</section>

      <section className="section-block">
        <div className="section-head">
          <h2>Ürün Kategorileri</h2>
          <p>Ürünün nerede kullanılacağını seç.</p>
        </div>

<div className="horizontal-scroll">
  {["Tümü", ...productCategories].map((category) => (
    <button
      key={category}
      className={
        activeProductFilter === category ? "category active" : "category"
      }
  onClick={() => openCategoryPage("product", category)}
    >
      <div className="category-visual">
        {PRODUCT_CATEGORY_ICONS[category] || "🌈"}
      </div>

      <span>{category}</span>
      <small>{getProductCategoryCount(category)} ürün</small>
    </button>
  ))}
</div>
      </section>




      <section className="section-block">
        <div className="section-head">
          <h2>Tasarım Kategorileri</h2>
          <p>Spor, aile, hayvanlar, çizgi film ve daha fazlası.</p>
        </div>



<div className="design-grid">
  {["Tümü", ...designCategories].map((category) => (
    <button
      key={category}
      className={
        activeDesignFilter === category ? "design-card active" : "design-card"
      }
      onClick={() => openCategoryPage("design", category)}
    >
      <div className="design-visual">
        {DESIGN_CATEGORY_ICONS[category] || "✨"}
      </div>

      <span>{category}</span>
      <small>{getDesignCategoryCount(category)} ürün</small>
    </button>
  ))}
</div>
      </section>

      <section id="products" className="section-block">
        <div className="section-head">
          <h2>Popüler Ürünler</h2>
          <p>Demo ürünler, fiyatlar Türk Lirası olarak gösterilir.</p>
        </div>

<div className="filter-summary">
  <div>
    <span>Aktif filtre:</span>
    <b>{activeProductFilter}</b>
    <b>{activeDesignFilter}</b>
    <small>{filteredProducts.length} ürün gösteriliyor</small>
  </div>

  <button onClick={clearFilters}>Filtreleri Temizle</button>
</div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <span>
                  {product.designCategory} / {product.productCategory}
                </span>
                <h3>{product.name}</h3>
                <strong>₺{product.price}</strong>
                <button onClick={() => addToCart(product)}>Sepete Ekle</button>
              </div>
            </article>
          ))}

          {filteredProducts.length === 0 && (
  <div className="no-products">
    Bu kategori için henüz ürün yok. Admin panelden ürün ekleyebilirsin.
  </div>
)}
        </div>
      </section>

  <section id="about" className="brand-info-section">
  <div className="brand-info-card">
    <div className="brand-info-main">
      <span className="section-kicker">Hakkımızda</span>

      <h2>Made Dreams kişiye özel tasarımı kolay ve eğlenceli hale getirir.</h2>

      <p>
        Kullanıcılar kendi fotoğraflarını yükleyebilir, ürün kategorisi
        seçebilir ve kişiye özel boyama ürünleri oluşturabilir. Bu demo proje;
        ürün keşfi, içerik pazarlaması, sepet, admin yönetimi ve müşteri
        deneyimini tek bir akışta gösterir.
      </p>

      <div className="brand-pills">
        <span>🎨 Custom Design</span>
        <span>🛒 Easy Shopping Flow</span>
        <span>📱 Instagram Focused</span>
        <span>📊 Admin Managed</span>
      </div>
    </div>

    <div className="brand-info-side">
      <div className="mini-trust-card">
        <strong>100%</strong>
        <span>Kişiye özel deneyim</span>
      </div>

      <div className="mini-trust-card">
        <strong>TRY</strong>
        <span>Türkiye pazarı için fiyatlandırma</span>
      </div>

      <div className="mini-trust-card">
        <strong>Demo</strong>
        <span>Admin panel ve sipariş yönetimi</span>
      </div>
    </div>
  </div>

  <div className="compact-bottom-grid">
    <div id="faq" className="compact-faq-card">
      <div className="compact-card-head">
        <span>SSS</span>
        <h3>Sık Sorulan Sorular</h3>
      </div>

      <details open>
        <summary>Kendi fotoğrafımı yükleyebilir miyim?</summary>
        <p>
          Evet. Kullanıcı kendi görselini yükleyip ürün tipini seçerek demo
          sipariş oluşturabilir.
        </p>
      </details>

      <details>
        <summary>Bu gerçek ödeme sistemi mi?</summary>
        <p>
          Hayır. Bu proje demo amaçlıdır. Sepet, ürünler ve siparişler
          LocalStorage ile çalışır.
        </p>
      </details>

      <details>
        <summary>Admin neleri yönetebilir?</summary>
        <p>
          Admin ürünleri, kategorileri, makaleleri, görselleri ve özel tasarım
          siparişlerini yönetebilir.
        </p>
      </details>
    </div>

    <div id="contact" className="compact-contact-card">
      <div className="compact-card-head">
        <span>İletişim</span>
        <h3>Hayalindeki tasarımı başlat.</h3>
      </div>

      <p>
        Özel siparişler, iş birlikleri ve tasarım fikirleri için Made Dreams ile
        iletişime geçebilirsin.
      </p>

      <div className="compact-contact-actions">
        <a href="https://instagram.com/" target="_blank" rel="noreferrer">
          📷 Instagram
        </a>

        <a href="mailto:info@madedreams.demo">
          ✉️ Email
        </a>
      </div>
    </div>
  </div>
</section>



      <section id="articles" className="articles-section">
  <div className="section-head">
    <div>
      <h2>Makaleler</h2>
      <p>Made Dreams, tasarım fikirleri ve özel hediye rehberleri.</p>
    </div>

   <button className="article-cta" onClick={() => goToPage("upload")}>
  Kendi Tasarımını Başlat
</button>
  </div>

  <div className="articles-grid">
    {articles.map((article) => (
      <article
  className="article-card"
  key={article.id}
  onClick={() => openArticle(article.id)}
>
        <div className="article-image-wrap">
          <img src={article.image} alt={article.title} />
          <span>{article.category}</span>
        </div>

        <div className="article-body">
          <small>
            {article.createdAt} • {article.readTime}
          </small>
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
<button
  onClick={(event) => {
    event.stopPropagation();
    openArticle(article.id);
  }}
>
  Devamını Oku
</button>        </div>
      </article>
    ))}
  </div>
</section>


        </>
)}


{page === "upload" && (
  <section id="upload" className="upload-section upload-page">
    <button className="back-button" onClick={() => setPage("home")}>
      ← Ana Sayfaya Dön
    </button>

    <div className="upload-page-hero">
      <div>
        <span className="section-kicker">Custom Upload</span>
        <h1>Kendi Tasarımını Yükle</h1>
        <p>
          Fotoğrafını yükle, ürün tipini seç ve Made Dreams için kişiye özel
          demo siparişini oluştur.
        </p>
      </div>
    </div>

    <div className="upload-content">
      <div>
        <div className="badge pink">Custom Upload</div>
        <h2>Kendi Tasarımını Yükle</h2>
        <p>
          Müşteri kendi fotoğrafını yükler, ürün tipini ve tasarım kategorisini
          seçer. Admin panelinde sipariş olarak görünür.
        </p>

        <div className="form-grid">
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Ad Soyad"
          />

          <select
            value={selectedProduct}
            onChange={(event) => setSelectedProduct(event.target.value)}
          >
            {productCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedDesign}
            onChange={(event) => setSelectedDesign(event.target.value)}
          >
            {designCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Not: renk tercihi, beden, özel istek..."
          ></textarea>

          <button className="submit-button" onClick={createCustomOrder}>
            Demo Sipariş Oluştur
          </button>
        </div>
      </div>

      <div className="preview-card">
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded preview" />
        ) : (
          <div className="empty-preview">Görsel önizleme burada görünecek</div>
        )}
      </div>
    </div>
  </section>
)}



{page === "category" && categoryPage && (
  <section className="category-detail-page">
    <button
      className="back-button"
      onClick={() => {
        setPage("home");
        setTimeout(() => {
          document.getElementById("products")?.scrollIntoView({
            behavior: "smooth",
          });
        }, 50);
      }}
    >
      ← Kategorilere Dön
    </button>

    <div className="category-detail-hero">
      <div className="category-detail-icon">
        {categoryPage.type === "product"
          ? PRODUCT_CATEGORY_ICONS[categoryPage.name] || "✨"
          : DESIGN_CATEGORY_ICONS[categoryPage.name] || "✨"}
      </div>

      <div>
        <span>
          {categoryPage.type === "product"
            ? "Ürün Kategorisi"
            : "Tasarım Kategorisi"}
        </span>

        <h1>{categoryPage.name}</h1>

        <p>
          {categoryPage.name === "Tümü"
            ? "Made Dreams içindeki tüm demo ürünleri burada görebilirsin."
            : `${categoryPage.name} kategorisine ait ürünleri burada inceleyebilirsin.`}
        </p>

        <div className="category-detail-meta">
          <b>{categoryPageProducts.length} ürün</b>
          <b>TRY ₺ fiyatlar</b>
          <b>Demo Store</b>
        </div>
      </div>
    </div>

    <div className="category-toolbar">
      <div>
        <strong>{categoryPage.name}</strong>
        <span>{categoryPageProducts.length} ürün listeleniyor</span>
      </div>

      <button
        onClick={() => {
          setPage("home");
          setTimeout(() => {
           goToPage("upload")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 50);
        }}
      >
        Kendi Tasarımını Yükle
      </button>
    </div>

    <div className="product-grid">
      {categoryPageProducts.map((product) => (
        <article className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} />

          <div className="product-info">
            <span>
              {product.designCategory} / {product.productCategory}
            </span>

            <h3>{product.name}</h3>
            <strong>₺{product.price}</strong>

            <button onClick={() => addToCart(product)}>Sepete Ekle</button>
          </div>
        </article>
      ))}

      {categoryPageProducts.length === 0 && (
        <div className="no-products">
          Bu kategori için henüz ürün yok. Admin panelden ürün ekleyebilirsin.
        </div>
      )}
    </div>
  </section>
)}

{page === "cart" && (
  <section className="cart-section">
    <div className="section-head">
      <h2>Sepet</h2>
      <p>Toplam: <b>₺{cartTotal}</b></p>
    </div>

    {cart.length === 0 ? (
      <div className="locked-admin">
        Sepetin boş. Ürünlerden birini sepete ekleyebilirsin.
      </div>
    ) : (
      <>
        <div className="cart-list">
          {cart.map((item, index) => (
            <article className="cart-row" key={`${item.id}-${index}`}>
              <img src={item.image} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>
                  {item.designCategory} / {item.productCategory}
                </p>
              </div>

              <strong>₺{item.price}</strong>

              <button onClick={() => removeFromCart(index)}>Sil</button>
            </article>
          ))}
        </div>

        <div className="cart-summary">
          <span>Genel Toplam</span>
          <strong>₺{cartTotal}</strong>
          <button onClick={clearCart}>Sepeti Temizle</button>
        </div>
      </>
    )}

    <div className="admin-top-actions">
      <button onClick={() => setPage("home")}>Alışverişe Dön</button>
    </div>
  </section>
)}


{page === "admin" && isAdmin && (

      <section id="admin" className="admin-section">
        <div className="section-head">
          <h2>Admin Panel Demo</h2>
          <p>
            Admin numarası: <b>05370530916</b>
          </p>
        </div>

        <div className="admin-top-actions">
            <button onClick={() => setPage("home")}>Siteye Dön</button>
        </div>

        {!isAdmin ? (
          <div className="locked-admin">
            Admin panelini görmek için demo admin numarasıyla giriş yap.
          </div>
        ) : (
          <>
            <div className="stats-grid">
  <div>
    <span>Sepet Ürünleri</span>
    <strong>{cart.length}</strong>
  </div>

  <div>
    <span>Sepet Toplamı</span>
    <strong>₺{cartTotal}</strong>
  </div>

  <div>
    <span>Özel Sipariş Toplamı</span>
    <strong>₺{ordersTotal}</strong>
  </div>

  <div>
    <span>Genel Toplam</span>
    <strong>₺{grandTotal}</strong>
  </div>
</div>

            <div className="admin-toolbar">
              <button onClick={clearDemoData}>Demo Verileri Temizle</button>
            </div>

            <div className="management-grid">
  <div className="manager-card">
    <h3>Ürün Kategorileri</h3>

    <div className="mini-form">
      <input
        value={newProductCategory}
        onChange={(event) => setNewProductCategory(event.target.value)}
        placeholder="Yeni kategori"
      />
      <button onClick={addProductCategory}>Ekle</button>
    </div>

    <div className="tag-list">
      {productCategories.map((category) => (
        <span key={category}>
          {category}
          <button onClick={() => removeProductCategory(category)}>×</button>
        </span>
      ))}
    </div>
  </div>

  <div className="manager-card">
    <h3>Tasarım Kategorileri</h3>

    <div className="mini-form">
      <input
        value={newDesignCategory}
        onChange={(event) => setNewDesignCategory(event.target.value)}
        placeholder="Yeni tasarım kategorisi"
      />
      <button onClick={addDesignCategory}>Ekle</button>
    </div>

    <div className="tag-list">
      {designCategories.map((category) => (
        <span key={category}>
          {category}
          <button onClick={() => removeDesignCategory(category)}>×</button>
        </span>
      ))}
    </div>
  </div>

  <div className="manager-card wide">
    <h3>Yeni Ürün Ekle</h3>

    <div className="product-admin-form">
      <input
        value={productForm.name}
        onChange={(event) =>
          setProductForm({ ...productForm, name: event.target.value })
        }
        placeholder="Ürün adı"
      />

      <input
        value={productForm.price}
        onChange={(event) =>
          setProductForm({ ...productForm, price: event.target.value })
        }
        placeholder="Fiyat"
        type="number"
      />

      <select
        value={productForm.productCategory}
        onChange={(event) =>
          setProductForm({
            ...productForm,
            productCategory: event.target.value,
          })
        }
      >
        {productCategories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>

      <select
        value={productForm.designCategory}
        onChange={(event) =>
          setProductForm({
            ...productForm,
            designCategory: event.target.value,
          })
        }
      >
        {designCategories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>

      <select
        value={productForm.image}
        onChange={(event) =>
          setProductForm({ ...productForm, image: event.target.value })
        }
      >
        <option value="/images/sample1.png">Sample 1</option>
        <option value="/images/sample2.png">Sample 2</option>
        <option value="/images/sample3.png">Sample 3</option>
        <option value="/images/sample4.png">Sample 4</option>
        <option value="/images/sample5.png">Sample 5</option>
        <option value="/images/sample6.png">Sample 6</option>
        <option value="/images/sample7.png">Sample 7</option>
        <option value="/images/sample8.png">Sample 8</option>
        <option value="/images/sample9.png">Sample 9</option>
        <option value="/images/sample10.png">Sample 10</option>
        <option value="/images/sample11.png">Sample 11</option>

       
        

      </select>

      <input
        className="admin-file-input"
        type="file"
        accept="image/*"
        onChange={handleAdminProductImageUpload}
/>

      <button onClick={addAdminProduct}>Ürün Ekle</button>
    </div>

    <div className="admin-products-list">
      {products.map((product) => (
        <div key={product.id} className="admin-product-row">
          <img src={product.image} alt={product.name} />
          <div>
            <b>{product.name}</b>
            <small>
              {product.designCategory} / {product.productCategory} — ₺
              {product.price}
            </small>
          </div>
          <button onClick={() => removeProduct(product.id)}>Sil</button>
        </div>
      ))}
    </div>
  </div>
</div>

<div className="manager-card wide articles-manager">
  <h3>Makale Yönetimi</h3>

  <div className="article-admin-form">
    <input
      value={articleForm.title}
      onChange={(event) =>
        setArticleForm({ ...articleForm, title: event.target.value })
      }
      placeholder="Makale başlığı"
    />

    <input
      value={articleForm.category}
      onChange={(event) =>
        setArticleForm({ ...articleForm, category: event.target.value })
      }
      placeholder="Kategori"
    />

    <input
      value={articleForm.readTime}
      onChange={(event) =>
        setArticleForm({ ...articleForm, readTime: event.target.value })
      }
      placeholder="Okuma süresi"
    />

    <select
      value={articleForm.image}
      onChange={(event) =>
        setArticleForm({ ...articleForm, image: event.target.value })
      }
    >
      <option value="/images/sample1.png">Sample 1</option>
      <option value="/images/sample2.png">Sample 2</option>
      <option value="/images/sample3.png">Sample 3</option>
      <option value="/images/logo.png">Logo</option>
    </select>

        <input
  className="admin-file-input"
  type="file"
  accept="image/*"
  onChange={handleAdminArticleImageUpload}
/>

    <textarea
      value={articleForm.excerpt}
      onChange={(event) =>
        setArticleForm({ ...articleForm, excerpt: event.target.value })
      }
      placeholder="Kısa açıklama"
    ></textarea>

    <textarea
  value={articleForm.content}
  onChange={(event) =>
    setArticleForm({ ...articleForm, content: event.target.value })
  }
  placeholder="Makalenin tam metni"
></textarea>

    <button onClick={addArticle}>Makale Ekle</button>
  </div>

  <div className="admin-articles-list">
    {articles.map((article) => (
      <div className="admin-article-row" key={article.id}>
        <img src={article.image} alt={article.title} />

        <div>
          <b>{article.title}</b>
          <small>
            {article.category} — {article.readTime}
          </small>
        </div>

        <button onClick={() => removeArticle(article.id)}>Sil</button>
      </div>
    ))}
  </div>
</div>

<h3 className="admin-subtitle">Uploaded Design Orders</h3>            


            <div className="orders-list">
              {orders.length === 0 && (
                <div className="empty-orders">Henüz özel sipariş yok.</div>
              )}

              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <img src={order.image} alt="Order upload" />

                  <div>
                    <h3>{order.customerName}</h3>
                    <p>
                      {order.productCategory} / {order.designCategory}
                    </p>
                     
                    <p>
                        <b>₺{order.price}</b>
                    </p>

                    <p>{order.note || "Not yok"}</p>
                    <small>{order.createdAt}</small>
                  </div>

                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateOrderStatus(order.id, event.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
)}

      
{page === "article" && selectedArticle && (
  <section className="article-detail-page">
    <button className="back-button" onClick={() => setPage("home")}>
      ← Makalelere Dön
    </button>

    <div className="article-detail-hero">
      <div className="article-detail-text">
        <span>{selectedArticle.category}</span>
        <h1>{selectedArticle.title}</h1>
        <p>{selectedArticle.excerpt}</p>

        <div className="article-meta">
          <b>{selectedArticle.createdAt}</b>
          <b>{selectedArticle.readTime}</b>
          <b>Made Dreams Blog</b>
        </div>
      </div>

      <div className="article-detail-image">
        <img src={selectedArticle.image} alt={selectedArticle.title} />
      </div>
    </div>

    <div className="article-reading-layout">
      <aside className="article-sidebar">
        <div>
          <span>Topic</span>
          <b>{selectedArticle.category}</b>
        </div>

        <div>
          <span>Reading Time</span>
          <b>{selectedArticle.readTime}</b>
        </div>

        <button onClick={() => goToPage("upload")}>
  Kendi Tasarımını Başlat
</button>
      </aside>

      <article className="article-reader">
        <p>{selectedArticle.content || selectedArticle.excerpt}</p>

        <h2>Made Dreams ile nasıl çalışır?</h2>
        <p>
          Kullanıcı önce ürün kategorisini seçer. Daha sonra tasarım
          kategorisini belirler veya kendi görselini yükler. Oluşturulan demo
          sipariş admin panelinde görüntülenir ve sipariş durumu yönetilebilir.
        </p>

        <h2>Neden kişiye özel tasarım?</h2>
        <p>
          Kişiye özel ürünler sadece bir eşya değil, aynı zamanda anı taşıyan
          özel parçalardır. Özellikle aile, çocuk, evcil hayvan ve özel gün
          tasarımları için bu deneyim çok daha anlamlı hale gelir.
        </p>
      </article>
    </div>
  </section>
)}

{showBackTop && (
  <button className="back-to-top" onClick={scrollToTop}>
    ↑
  </button>
)}

    <footer className="site-footer">
  <div className="footer-top">
    <div className="footer-brand">
  <div className="footer-brand-mark">
    <span>MD</span>
    <i>✦</i>
  </div>

  <h3>Made Dreams</h3>

  <p>
    Kişiye özel boyama setleri, tasarım ürünleri ve yaratıcı hediye
    deneyimleri için hazırlanmış Türkiye odaklı demo e-ticaret sitesi.
  </p>

  <a
    className="instagram-link"
    href="https://instagram.com/"
    target="_blank"
    rel="noreferrer"
  >
    <span>📷</span>
    Instagram’da Takip Et
  </a>
</div>

    <div className="footer-column">
      <h4>Site</h4>
      <button
        onClick={() => {
          setPage("home");
          setTimeout(() => {
            document.getElementById("products")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 50);
        }}
      >
        Ürünler
      </button>

      <button
        onClick={() => {
          setPage("home");
          setTimeout(() => {
            document.getElementById("articles")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 50);
        }}
      >
        Makaleler
      </button>

      <button onClick={() => goToPage("upload")}>
  Tasarım Yükle
</button>

    </div>

    <div className="footer-column">
      <h4>Kurumsal</h4>
      <button
        onClick={() => {
          setPage("home");
          setTimeout(() => {
            document.getElementById("about")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 50);
        }}
      >
        Hakkımızda
      </button>

      <button
        onClick={() => {
          setPage("home");
          setTimeout(() => {
            document.getElementById("faq")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 50);
        }}
      >
        Sık Sorulan Sorular
      </button>

      <button
        onClick={() => {
          setPage("home");
          setTimeout(() => {
            document.getElementById("contact")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 50);
        }}
      >
        İletişim
      </button>
    </div>

    <div className="footer-column">
      <h4>Demo Bilgisi</h4>
      <p>Admin Panel</p>
      <p>LocalStorage Data</p>
      <p>React + Vite Demo</p>
      <p>Türkiye Pazarı</p>
    </div>
  </div>

  <div className="footer-bottom">
    <span>© 2026 Made Dreams Demo Store</span>
    <span>Designed for Marketing Presentation</span>
  </div>
</footer>


    </main>
  );
}