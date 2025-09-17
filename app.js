const courses = [
  {
    id: "ux-foundations",
    title: "UX/UI Design Foundations",
    category: "Design",
    level: "Beginner",
    duration: "6 weeks",
    instructor: "Ava Martin",
    price: "$129",
    description:
      "Build a strong foundation in user research, wireframing, and visual systems with hands-on exercises.",
    details: [
      "Plan user interviews and synthesize insights into actionable personas.",
      "Create wireframes in Figma and handoff to developers with polished UI kits.",
      "Earn a portfolio-ready case study and certification."
    ]
  },
  {
    id: "fullstack-launchpad",
    title: "Full-Stack JavaScript Launchpad",
    category: "Development",
    level: "Intermediate",
    duration: "8 weeks",
    instructor: "Noah Elbaz",
    price: "$189",
    description:
      "Master the MERN stack with real-world projects and mentorship from senior engineers.",
    details: [
      "Build RESTful APIs with Express and secure them with JWT-based auth.",
      "Design responsive React interfaces with state management best practices.",
      "Deploy to modern cloud platforms and automate CI/CD pipelines."
    ]
  },
  {
    id: "data-storytelling",
    title: "Data Storytelling with Python",
    category: "Data Science",
    level: "Intermediate",
    duration: "5 weeks",
    instructor: "Maya Chen",
    price: "$159",
    description:
      "Turn raw data into compelling narratives using pandas, Plotly, and presentation frameworks.",
    details: [
      "Wrangle datasets and extract insights with pandas and SQL techniques.",
      "Build interactive dashboards and visualizations in Plotly and Tableau.",
      "Present findings with storytelling frameworks that resonate with stakeholders."
    ]
  },
  {
    id: "product-led-growth",
    title: "Product-Led Growth Playbook",
    category: "Business",
    level: "Advanced",
    duration: "4 weeks",
    instructor: "Dina Korhonen",
    price: "$139",
    description:
      "Design experiments, build activation loops, and lead cross-functional growth initiatives.",
    details: [
      "Create customer journey maps and identify activation moments that matter.",
      "Run data-informed experiments and analyze funnel metrics with rigor.",
      "Establish scalable feedback loops between product, marketing, and success teams."
    ]
  },
  {
    id: "ai-for-creatives",
    title: "Generative AI for Creatives",
    category: "Creative",
    level: "Beginner",
    duration: "3 weeks",
    instructor: "Liam de Vries",
    price: "$99",
    description:
      "Prototype visuals, copy, and campaigns using AI tools while maintaining human-centered storytelling.",
    details: [
      "Prompt image, video, and audio models to ideate faster without sacrificing originality.",
      "Establish ethical guardrails for responsible AI adoption across teams.",
      "Ship a creative campaign with an AI-assisted workflow and present it to peers."
    ]
  },
  {
    id: "digital-ads-strategy",
    title: "Digital Ads Strategy Lab",
    category: "Marketing",
    level: "Intermediate",
    duration: "5 weeks",
    instructor: "Sofia Patel",
    price: "$149",
    description:
      "Develop omnichannel campaigns with paid social, search, and analytics experimentation.",
    details: [
      "Plan budgets across channels and build measurement frameworks that scale.",
      "Craft high-converting ad creative backed by audience research.",
      "Analyze performance data to iterate in weekly growth sprints."
    ]
  }
];

const courseGrid = document.getElementById("course-grid");
const filterContainer = document.querySelector(".catalog__filters");
const searchInput = document.getElementById("search-input");

let activeFilter = "All";

function createCourseCard(course) {
  const card = document.createElement("article");
  card.className = "course-card";
  card.dataset.category = course.category;
  card.dataset.level = course.level;

  const badge = document.createElement("span");
  badge.className = "course-card__badge";
  badge.textContent = `${course.category} • ${course.level}`;

  const title = document.createElement("h3");
  title.textContent = course.title;

  const description = document.createElement("p");
  description.textContent = course.description;

  const meta = document.createElement("div");
  meta.className = "course-card__meta";
  meta.innerHTML = `
    <span>${course.duration}</span>
    <span>Instructor: ${course.instructor}</span>
  `;

  const actions = document.createElement("div");
  actions.className = "course-card__actions";

  const price = document.createElement("span");
  price.className = "course-card__price";
  price.textContent = course.price;

  const toggleButton = document.createElement("button");
  toggleButton.className = "course-card__toggle";
  toggleButton.type = "button";
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", `details-${course.id}`);
  toggleButton.textContent = "View details";

  const details = document.createElement("div");
  details.className = "course-card__details";
  details.id = `details-${course.id}`;
  details.hidden = true;

  const list = document.createElement("ul");
  list.style.padding = "0";
  list.style.margin = "0";
  list.style.listStyle = "none";
  list.style.display = "grid";
  list.style.gap = "0.75rem";

  course.details.forEach((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    list.appendChild(item);
  });

  details.appendChild(list);

  toggleButton.addEventListener("click", () => {
    const isExpanded = card.classList.toggle("is-expanded");
    toggleButton.setAttribute("aria-expanded", String(isExpanded));
    toggleButton.textContent = isExpanded ? "Hide details" : "View details";
    details.hidden = !isExpanded;
  });

  actions.append(price, toggleButton);
  card.append(badge, title, description, meta, actions, details);

  return card;
}

function renderCourses(list) {
  courseGrid.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("p");
    empty.textContent = "No courses match your filters just yet. Try another keyword or category.";
    empty.style.gridColumn = "1 / -1";
    courseGrid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach((course) => {
    fragment.appendChild(createCourseCard(course));
  });
  courseGrid.appendChild(fragment);
}

function renderFilters() {
  const categories = ["All", ...new Set(courses.map((course) => course.category))];
  filterContainer.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category;
    button.dataset.filter = category;

    if (category === activeFilter) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      activeFilter = category;
      updateFilterState();
      applyFilters();
    });

    filterContainer.appendChild(button);
  });
}

function updateFilterState() {
  const buttons = filterContainer.querySelectorAll(".filter-button");
  buttons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = courses.filter((course) => {
    const matchesCategory = activeFilter === "All" || course.category === activeFilter;

    if (!matchesCategory) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      course.title,
      course.category,
      course.level,
      course.duration,
      course.instructor,
      course.description,
      course.details.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  renderCourses(filtered);
}

function setupSearch() {
  searchInput.addEventListener("input", () => {
    window.requestAnimationFrame(applyFilters);
  });
}

function setupNavigation() {
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__menu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("nav__menu--open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("nav__menu--open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  const mediaQuery = window.matchMedia("(min-width: 961px)");
  const handleResize = (event) => {
    if (event.matches) {
      navMenu.classList.remove("nav__menu--open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  };

  mediaQuery.addEventListener("change", handleResize);
}

function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function init() {
  renderFilters();
  renderCourses(courses);
  setupSearch();
  setupNavigation();
  setCurrentYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
