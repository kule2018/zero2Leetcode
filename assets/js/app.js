/**
 * Zero2Leetcode - 前端交互逻辑
 */

document.addEventListener('DOMContentLoaded', function () {
    // 初始化所有模块
    initNavbar();
    initProblemsTable();
    initFilters();
    initSearch();
    initModuleCards();
});

/**
 * 导航栏逻辑
 */
function initNavbar() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // 点击链接后关闭移动端菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // 滚动时改变导航栏样式
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.85)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * 渲染题目表格
 */

// Playground 已收录的题目 ID 集合
const PLAYGROUND_PROBLEM_IDS = new Set([1, 20, 21, 35, 70, 118, 121, 136, 169, 206, 283]);

function initProblemsTable() {
    renderProblemsTable(window.PROBLEMS_DATA || []);
}

function renderProblemsTable(problems) {
    const tbody = document.getElementById('problems-tbody');
    if (!tbody || !Array.isArray(problems)) return;

    tbody.innerHTML = problems.map(problem => {
        const hasLocal = PLAYGROUND_PROBLEM_IDS.has(problem.id);
        const practiceHtml = hasLocal
            ? `<a href="playground.html?id=${problem.id}" class="practice-link practice-local">本地练习</a>
               <a href="${problem.url}" target="_blank" rel="noopener" class="practice-link practice-lc">LeetCode ↗</a>`
            : `<a href="${problem.url}" target="_blank" rel="noopener" class="practice-link">LeetCode ↗</a>`;

        return `
        <tr data-difficulty="${problem.difficulty}" data-category="${problem.category}">
            <td class="problem-number">${problem.id}</td>
            <td class="problem-title">
                <a href="${problem.url}" target="_blank" rel="noopener">
                    ${problem.title}
                </a>
            </td>
            <td>
                <span class="difficulty-badge ${problem.difficulty}">
                    ${getDifficultyIcon(problem.difficulty)} ${window.DIFFICULTY_NAMES[problem.difficulty] || problem.difficulty}
                </span>
            </td>
            <td>
                <span class="category-badge">
                    ${window.CATEGORY_NAMES[problem.category] || problem.category}
                </span>
            </td>
            <td class="practice-links">
                ${practiceHtml}
            </td>
        </tr>`;
    }).join('');
}

function getDifficultyIcon(difficulty) {
    const icons = {
        'easy': '🟢',
        'medium': '🟡',
        'hard': '🔴'
    };
    return icons[difficulty] || '';
}

/**
 * 筛选功能
 */
function initFilters() {
    // 难度筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilters();
        });
    });

    // 分类下拉框
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const difficultyFilter = activeBtn ? activeBtn.dataset.filter : 'all';

    const categorySelect = document.getElementById('category-filter');
    const categoryFilter = categorySelect ? categorySelect.value : 'all';

    const searchInput = document.getElementById('problem-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const rows = document.querySelectorAll('#problems-tbody tr');

    rows.forEach(row => {
        const difficulty = row.dataset.difficulty;
        const category = row.dataset.category;
        const title = row.querySelector('.problem-title')?.textContent.toLowerCase() || '';
        const number = row.querySelector('.problem-number')?.textContent || '';

        const matchesDifficulty = difficultyFilter === 'all' || difficulty === difficultyFilter;
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        const matchesSearch = searchTerm === '' ||
            title.includes(searchTerm) ||
            number.includes(searchTerm);

        if (matchesDifficulty && matchesCategory && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    updateResultsCount();
}

function updateResultsCount() {
    const visibleRows = document.querySelectorAll('#problems-tbody tr:not([style*="display: none"])');
    const totalRows = document.querySelectorAll('#problems-tbody tr');

    const footer = document.querySelector('.problems-footer p');
    if (footer) {
        if (visibleRows.length < totalRows.length) {
            footer.innerHTML = `显示 <strong>${visibleRows.length}</strong> / ${totalRows.length} 道题目 | 💡 提示：本地学习后，务必到 LeetCode 验证你的代码是否通过所有测试用例！`;
        } else {
            footer.innerHTML = `💡 提示：本地学习后，务必到 LeetCode 验证你的代码是否通过所有测试用例！`;
        }
    }
}

/**
 * 搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('problem-search');
    if (searchInput) {
        // 使用防抖处理搜索输入
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFilters, 200);
        });
    }
}

/**
 * 模块卡片点击交互
 */
function initModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');

    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            // 获取模块分类
            const moduleTitle = card.querySelector('h3')?.textContent;

            // 映射模块名到筛选分类
            const categoryMap = {
                '数组与字符串': 'subarray',
                '链表': 'linked-list',
                '栈与队列': 'stack',
                '哈希表': 'hash',
                '二叉树': 'tree',
                '图论': 'graph',
                '二分查找': 'binary-search',
                '双指针': 'two-pointers',
                '滑动窗口': 'sliding-window',
                '回溯': 'backtrack',
                '动态规划': 'dp',
                '贪心算法': 'greedy'
            };

            const category = categoryMap[moduleTitle];

            if (category) {
                // 滚动到题目区域
                const problemsSection = document.getElementById('problems');
                if (problemsSection) {
                    problemsSection.scrollIntoView({ behavior: 'smooth' });

                    // 延迟设置筛选器（等滚动完成）
                    setTimeout(() => {
                        const categoryFilter = document.getElementById('category-filter');
                        if (categoryFilter) {
                            categoryFilter.value = category;
                            applyFilters();
                        }
                    }, 500);
                }
            }
        });
    });
}

/**
 * 平滑滚动到锚点
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * 添加滚动动画
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.roadmap-item, .module-card').forEach(el => {
        observer.observe(el);
    });
}

// 页面加载完成后初始化滚动动画
window.addEventListener('load', initScrollAnimations);
