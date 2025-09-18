document.addEventListener("alpine:init", () => {
  Alpine.data("mainApp", () => ({
    isOpen: false,
    showBackToTop: false,
    lang: new URLSearchParams(window.location.search).get("lang") || "zh",

    init() {
      // 監聽語言變更
      this.$watch("lang", (value) => {
        // 更新 URL 參數
        const url = new URL(window.location);
        if (value === "zh") {
          url.searchParams.delete("lang");
        } else {
          url.searchParams.set("lang", value);
        }
        window.history.pushState({}, "", url);

        // 更新 HTML lang 屬性
        document.documentElement.lang = value === "en" ? "en" : "zh-Hant-TW";

        // 更新 meta 標籤
        document.querySelector('meta[property="og:locale"]').content = value === "en" ? "en_US" : "zh_TW";

        // 更新 canonical 和 alternate 連結
        const canonical = document.querySelector('link[rel="canonical"]');
        const alternates = document.querySelectorAll('link[rel="alternate"]');
        const baseUrl = window.location.origin;

        canonical.href = value === "en" ? `${baseUrl}?lang=en` : baseUrl;
        alternates.forEach((alternate) => {
          if (alternate.hreflang === "en") {
            alternate.href = `${baseUrl}?lang=en`;
          } else if (alternate.hreflang === "zh-Hant") {
            alternate.href = baseUrl;
          }
        });
      });
    },
    getExperienceYears() {
      const startDate = new Date("2021-06-01");
      const now = new Date();
      const diffInMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth();
      const years = Math.floor(diffInMonths / 12);
      const months = diffInMonths % 12;
      return this.lang === "zh" ? `${years} 年 ${months} 個月開發經驗` : `${years} Years and ${months} Months of Experience`;
    },
    uiText: {
      zh: {
        about: "關於我",
        experience: "工作經歷",
        projects: "開發專案",
        blog: "文章",
        contact: "聯絡我",
        recommendations: "推薦",
        role: "網頁全端工程師 & AI Agent 工程師",
        featuredProjects: "個人作品",
        moreProjects: "更多作品",
        noMoreProjects: "尚未釋出更多作品",
        openSourceProjects: "開源合作",
        viewDetails: "查看詳情",
        view: "查看",
        projectRole: "擔任角色",
        projectContribution: "主要貢獻",
        maintainer: "專案維護者",
        contributor: "專案貢獻者",
        collaborator: "協同開發者",
        viewGithub: "查看 GitHub",
        viewDemo: "查看展示",
        featuredArticles: "精選文章",
        allArticles: "所有文章",
        readingTime: "分鐘閱讀",
        contactMe: "聯絡方式",
        supportMe: "支持我",
        buyMeCoffee: "請我喝杯咖啡",
        aboutFooter: "網頁全端工程師與 AI Agent 工程師，致力於創造優質的使用者體驗。",
        quickLinks: "快速連結",
        skills: "技能專長",
        frontEnd: "前端開發",
        backEnd: "後端開發",
        aiDev: "AI 開發",
        socialMedia: "社群媒體",
        allRightsReserved: "版權所有",
        backToTop: "回到頂部",
        recommendations: "推薦內容",
        recommendedProjects: "推薦專案",
        recommendedArticles: "推薦文章",
        projectType: "專案類型",
        articleType: "文章類型",
        personalProject: "個人作品",
        openSourceWork: "開源貢獻",
        recommendedWork: "推薦作品",
        personalArticle: "原創文章",
        sharedArticle: "分享文章",
        originalAuthor: "原作者",
        projectOwner: "專案擁有者",
        recommendReason: "推薦原因",
        freelanceProjects: "接案經驗",
        projectCategory: "類型",
        projectPeriod: "開發週期",
        projectHighlights: "重點",
        clientPrivacy: "為保護客戶隱私與商業機密，以下內容僅列舉部分專案並概述專案性質與重點",
        faq: "常見問題",
      },
      en: {
        about: "About",
        experience: "Work Experience",
        projects: "Projects",
        blog: "Blog",
        contact: "Contact Me",
        recommendations: "Recommendations",
        role: "Web Full-stack & AI Agent Engineer",
        featuredProjects: "Personal Projects",
        moreProjects: "More Projects",
        noMoreProjects: "No more projects available yet",
        openSourceProjects: "Open Source",
        viewDetails: "View Details",
        view: "View",
        projectRole: "Role",
        projectContribution: "Contributions",
        maintainer: "Maintainer",
        contributor: "Contributor",
        collaborator: "Collaborator",
        viewGithub: "View on GitHub",
        viewDemo: "View Demo",
        featuredArticles: "Featured Articles",
        allArticles: "All Articles",
        readingTime: "min read",
        contactMe: "Contact Info",
        supportMe: "Support Me",
        buyMeCoffee: "Buy me a coffee",
        aboutFooter: "Web Full-stack and AI Agent Engineer, dedicated to creating excellent digital experiences.",
        quickLinks: "Quick Links",
        skills: "Skills",
        frontEnd: "Front-end",
        backEnd: "Back-end",
        aiDev: "AI Related",
        socialMedia: "Social Media",
        allRightsReserved: "All rights reserved",
        backToTop: "Back to Top",
        recommendations: "Recommendations",
        recommendedProjects: "Recommended Projects",
        recommendedArticles: "Recommended Articles",
        projectType: "Project Type",
        articleType: "Article Type",
        personalProject: "Personal Project",
        openSourceWork: "Open Source Work",
        recommendedWork: "Recommended Work",
        personalArticle: "Original Article",
        sharedArticle: "Shared Article",
        originalAuthor: "Original Author",
        projectOwner: "Project Owner",
        recommendReason: "Why Recommended",
        freelanceProjects: "Freelance Experience",
        projectCategory: "Category",
        projectPeriod: "Development Period",
        projectHighlights: "Highlights",
        clientPrivacy: "To protect client privacy and business confidentiality, the following content only outlines a few projects and their nature and highlights",
        faq: "Frequently Asked Questions",
      },
    },
    content: {
      zh: {
        aboutMe: "我是一位專注於全端開發與 AI Agent 開發的資深工程師，擁有豐富的實戰經驗。在過去的職業生涯中，我參與過多項專案的開發，並且持續關注新技術的發展趨勢。",
        skills: {
          frontEnd: "React, Flutter",
          backEnd: "Node.js, DB",
          aiDev: "Generator Agent, MCP",
          devOps: "Docker",
        },
        experience: [
          {
            title: "全端工程師",
            period: "2021 - 至今",
            achievements: ["領導開發團隊完成大型專案", "優化程式架構", "導入工具、改善開發流程與效率"],
          },
        ],
        featuredProjects: [
          {
            title: "打詐文本分析系統",
            description: "透過大型語言模型（LLM）進行文本分析的系統，旨在分析詐騙訊息、提昇防詐意識。",
            image: "/assets/fraud_prevention_banner.png",
            icon: "/assets/fraud_prevention_icon.png",
            demoLink: "#",
            githubLink: "https://github.com/cablate/Fraud-Prevention",
          },
          {
            title: "Dive App",
            description: "支援介接 Dive Desktop Server API 的行動裝置 AI Agent  App",
            image: "/assets/dive_app_banner.png",
            icon: "/assets/dive_desktop_icon.svg",
            demoLink: "#",
            githubLink: "https://github.com/cablate/Dive-APP",
          },
        ],
        openSourceProjects: [
          {
            title: "Rice Call (rc-voice)",
            description: "RaidCall 非官方復刻網頁版",
            role: "contributor",
            contributions: ["優化前端網頁效能", "優化資料儲存結構", "Bug 修復"],
            icon: "/assets/rice_call_icon.png",
            githubLink: "https://github.com/Nerdy-Home-ReOpen/rc-voice",
          },
          {
            title: "麦麦！MaiMBot",
            description: "麥麥 QQ 水群聊天互動機器人",
            role: "contributor",
            contributions: ["支援 Telegram 與 Discord 平台"],
            icon: "https://github.com/SengokuCola/MaiMBot/raw/main/docs/video.png",
            githubLink: "https://github.com/SengokuCola/MaiMBot",
          },
        ],
        recommendedProjects: [
          {
            title: "Dive",
            description: "支援多桌面平台的 AI Agent 桌面應用程式，並且整合了 MCP Server，可以讓使用者更方便地使用 AI Agent。",
            owner: "OpenAgentPlatform",
            ownerLink: "https://github.com/OpenAgentPlatform",
            icon: "assets/dive_desktop_icon.svg",
            githubLink: "https://github.com/OpenAgentPlatform/Dive",
            reason: "支援多桌面平台的 AI Agent 桌面應用程式，並且整合了 MCP Server，可以讓使用者更方便地使用 AI Agent。",
          },
        ],
        freelanceProjects: [
          {
            title: "簡易購物平台網站",
            category: "電子商務",
            period: "3個月",
            highlights: ["會員管理與商品管理", "購物車與訂單管理", "支援超商取貨等資訊"],
          },
          {
            title: "LINE 記事本爬蟲工具",
            category: "數據爬取與分析",
            highlights: ["爬取文章作者與標題", "擷取文章內容與留言", "結構化整理與儲存", "支援批量處理"],
          },
          {
            title: "資料整理與後台展示系統",
            category: "數據處理與視覺化",
            highlights: ["整合並整理既有數據", "分散數據的統一分類", "提供最終狀態分析", "表格化後台視覺展示"],
          },
          {
            title: "ERP 管理系統",
            category: "企業應用系統",
            highlights: ["專為主管與管理層設計", "數據電子化與現代化管理", "提升業務流程效率", "支援多角色權限管理"],
          },
          {
            title: "2D 小遊戲 APP",
            category: "遊戲開發",
            highlights: ["簡易 2D 文本冒險遊戲", "適用於 Android 平台", "支援基本互動與分支劇情", "輕量級遊戲體驗"],
          },
        ],
        faqs: [
          {
            question: "什麼是 AI Agent 開發？",
            answer: "AI Agent 開發是指創建能夠自主執行任務的智能代理程式。這些代理能夠理解用戶需求、做出決策，並與外部系統進行交互。我專精於使用 LangChain、OpenAI API 和 MCP (Model Context Protocol) 來構建高效的 AI Agent 系統。",
          },
          {
            question: "您有哪些專業技能和經驗？",
            answer: "我擁有 3+ 年的全端開發經驗，專精於：<br>• <strong>前端開發</strong>：React、TypeScript、Tailwind CSS<br>• <strong>後端開發</strong>：Node.js、資料庫管理、API 開發<br>• <strong>AI 開發</strong>：Generator Agent、MCP、LLM 整合<br>• <strong>DevOps</strong>：Docker、Git、Vercel、PWA 開發",
          },
          {
            question: "如何與您聯絡合作？",
            answer: "您可以透過以下方式與我聯絡：<br>• Email: cablate@cablate.com<br>• GitHub: <a href='https://github.com/cablate' class='text-secondary hover:text-white transition-colors'>@cablate</a><br>• Threads: <a href='https://www.threads.net/@cab_late' class='text-secondary hover:text-white transition-colors'>@cab_late</a><br>我樂意討論各種技術專案合作機會。",
          },
          {
            question: "您曾經手的專案有哪些？",
            answer: "我的主要專案包括：<br>• <strong>打詐文本分析系統</strong>：使用 LLM 技術分析詐騙訊息<br>• <strong>Dive App</strong>：AI Agent 移動應用程式<br>• <strong>AnxiousStock</strong>：投資模擬遊戲<br>• 多個電商平台和企業管理系統的開發",
          },
          {
            question: "您接受接案委託或合作邀約嗎？",
            answer: "是的，我有專業團隊，可以接受各種規模的專案委託，包括：<br>• 電商平台開發<br>• 企業管理系統<br>• AI 應用程式開發<br>• 移動應用程式<br>• 數據處理與分析系統<br>為保護客戶隱私，我會遵守嚴格的保密協議。",
          },
        ],
      },
      en: {
        aboutMe: "I am a senior engineer focused on full-stack development and AI Agent development, with rich practical experience. Throughout my career, I have participated in multiple large-scale projects while keeping up with emerging technology trends.",
        skills: {
          frontEnd: "React, Flutter",
          backEnd: "Node.js, DB",
          aiDev: "Generator Agent, MCP",
          devOps: "Docker",
        },
        experience: [
          {
            title: "Full-stack Engineer",
            period: "2021 - Present",
            achievements: ["Led development team in completing major projects", "Optimized program architecture", "Introduced tools, improved development process and efficiency"],
          },
        ],
        featuredProjects: [
          {
            title: "AI Anti-Scam Text Analysis System",
            description: "A system for text analysis using large language models (LLMs), designed to analyze scam messages and enhance fraud awareness.",
            image: "/assets/fraud_prevention_banner.png",
            icon: "/assets/fraud_prevention_icon.png",
            demoLink: "#",
            githubLink: "https://github.com/cablate/Fraud-Prevention",
          },
          {
            title: "Dive App",
            description: "A mobile AI Agent app that supports Dive Desktop Server API",
            image: "/assets/dive_app_banner.png",
            icon: "/assets/dive_desktop_icon.svg",
            demoLink: "#",
            githubLink: "https://github.com/cablate/Dive-APP",
          },
        ],
        openSourceProjects: [
          {
            title: "Rice Call (rc-voice)",
            description: "Unofficial web version recreation of RaidCall",
            role: "contributor",
            contributions: ["Optimized front-end performance", "Optimized data storage structure", "Bug fixes"],
            icon: "/assets/rice_call_icon.png",
            githubLink: "https://github.com/Nerdy-Home-ReOpen/rc-voice",
          },
          {
            title: "MaiMBot",
            description: "MaiMBot QQ group chat interaction robot",
            role: "contributor",
            contributions: ["Supports Telegram and Discord platforms"],
            icon: "https://github.com/SengokuCola/MaiMBot/raw/main/docs/video.png",
            githubLink: "https://github.com/SengokuCola/MaiMBot",
          },
        ],
        recommendedProjects: [
          {
            title: "Dive",
            description: "A cross-platform AI Agent desktop application that seamlessly integrates any Tools Call-supported LLM with MCP Server",
            owner: "OpenAgentPlatform",
            ownerLink: "https://github.com/OpenAgentPlatform",
            icon: "assets/dive_desktop_icon.svg",
            githubLink: "https://github.com/OpenAgentPlatform/Dive",
            reason: "A powerful AI Agent desktop application that supports multiple platforms and integrates with MCP Server, making it easier for users to work with AI Agents.",
          },
        ],
        freelanceProjects: [
          {
            title: "Simple E-Commerce Platform Website",
            category: "E-Commerce",
            highlights: ["User and product management", "Shopping cart and order management", "Integration with convenience store pickup"],
          },
          {
            title: "LINE Notebook Crawler Tool",
            category: "Data Scraping & Analysis",
            highlights: ["Extracts article author and title", "Retrieves article content and comments", "Structured data storage", "Supports batch processing"],
          },
          {
            title: "Data Processing & Backend Display System",
            category: "Data Processing & Visualization",
            highlights: ["Organized existing database data", "Unified classification of scattered data", "Final state analysis", "Tabular backend visualization"],
          },
          {
            title: "ERP Management System",
            category: "Enterprise Applications",
            highlights: ["Designed for managers and executives", "Digitalization and modernization of data management", "Improved business process efficiency", "Multi-role permission management"],
          },
          {
            title: "2D Mini Game App",
            category: "Game Development",
            highlights: ["Simple 2D text adventure game", "Developed for Android platform", "Basic interaction and branching storylines", "Lightweight gaming experience"],
          },
        ],
        faqs: [
          {
            question: "What is AI Agent development?",
            answer: "AI Agent development involves creating intelligent software agents that can autonomously execute tasks. These agents can understand user requirements, make decisions, and interact with external systems. I specialize in using LangChain, OpenAI API, and MCP (Model Context Protocol) to build efficient AI Agent systems.",
          },
          {
            question: "What are your professional skills and experience?",
            answer: "I have 3+ years of full-stack development experience, specializing in:<br>• <strong>Frontend Development</strong>: React, TypeScript, Tailwind CSS<br>• <strong>Backend Development</strong>: Node.js, Database Management, API Development<br>• <strong>AI Development</strong>: Generator Agent, MCP, LLM Integration<br>• <strong>DevOps</strong>: Docker, Git, Vercel, PWA Development",
          },
          {
            question: "How can I contact you for collaboration?",
            answer: "You can reach me through the following channels:<br>• Email: cablate@cablate.com<br>• GitHub: <a href='https://github.com/cablate' class='text-secondary hover:text-white transition-colors'>@cablate</a><br>• Threads: <a href='https://www.threads.net/@cab_late' class='text-secondary hover:text-white transition-colors'>@cab_late</a><br>I'm always open to discussing technical project collaboration opportunities.",
          },
          {
            question: "What projects did you work?",
            answer: "My past projects include:<br>• <strong>AI Anti-Scam Text Analysis System</strong>: Using LLM technology to analyze fraudulent messages<br>• <strong>Dive App</strong>: AI Agent mobile application<br>• <strong>AnxiousStock</strong>: Investment simulation game<br>• Multiple e-commerce platforms and enterprise management systems",
          },
          {
            question: "Do you accept freelance projects?",
            answer: "Yes, I accept projects of various scales, including:<br>• E-commerce platform development<br>• Enterprise management systems<br>• AI application development<br>• Mobile applications<br>• Data processing and analysis systems<br>I maintain strict confidentiality agreements to protect client privacy.",
          },
        ],
        moreProjects: [],
      },
    },
  }));
});
