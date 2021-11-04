(function() {

const calcTheme = v => (v === "dark") ? "dark" : "light";
let giscusScript = null;

/**
 * Inserts the Giscus script into the page.
 */
function insertGiscusScript()
{
	const isDarkMode 	= calcTheme(document.documentElement.getAttribute("data-theme"));
	const pathName		= window.location.pathname;
	let term			= pathName.length < 2 ? 'index' : pathName.substr(1).replace(/\.\w+$/, '');
	if (term.endsWith('/'))
		term = term.substr(0, term.length - 1);

	// DON'T EDIT BELOW THIS LINE
	var d = document,
		s = d.createElement("script");
	s.src = "https://giscus.app/client.js";
	s.setAttribute("data-repo",					"PoetaKodu/CppLangNet");
	s.setAttribute("data-repo-id",				"R_kgDOGHXK8w");
	s.setAttribute("data-category",				"Site comment section");
	s.setAttribute("data-category-id",			"DIC_kwDOGHXK884B_uFs");
	s.setAttribute("data-mapping",				"specific");
	s.setAttribute("data-term",					`Site-${term}-comment-section`);
	s.setAttribute("data-reactions-enabled",	"1");
	s.setAttribute("data-emit-metadata",		"0");
	s.setAttribute("data-theme",				isDarkMode ? 'dark' : 'light');
	s.setAttribute("data-lang",					"en");
	s.setAttribute("crossorigin",				"anonymous");
	s.setAttribute("async",						"true");
	(d.head || d.body).appendChild(s);

	giscusScript = s;
}

function sendMessageToGiscusIframe(message)
{
	const iframe = document.querySelector('iframe.giscus-frame');
	if (!iframe)
		return;
	iframe.contentWindow.postMessage({ giscus: message }, '*');
}

function destroyPreviousGiscus() {
	if (giscusScript)
		giscusScript.remove();

	const iframe = document.querySelector('iframe.giscus-frame');
	if (!iframe)
		return
	iframe.remove();
}

function handlePageLoad()
{
	const postContainer	= document.querySelector(".pagination-nav")?.parentNode;
	
	if (!postContainer)
	{
		console.warn("(Giscus comments) could not find post content.");
		return;
	}

	const validRoutes = [
		"/learn",
		"/docs",
		"/features",
		"/tools",
	];

	const isValidRoute = validRoutes.findIndex(
			route => (window.location.pathname.indexOf(route) !== -1)
		) !== -1;

	if (postContainer && isValidRoute)
	{
		destroyPreviousGiscus();

		const hr				= document.createElement("hr");
		const giscusContainer	= document.createElement("div");
		giscusContainer.className = "giscus";

		postContainer.appendChild(hr);
		postContainer.appendChild(giscusContainer);
		insertGiscusScript();
	}
}

function handlePageLoadAsync() {
	setTimeout(handlePageLoad, 500);
}

const onLocationChange = () => handlePageLoadAsync();

document.addEventListener("DOMContentLoaded",
	() => {
		handlePageLoadAsync();
	}
);

window.addEventListener("load", () => {
	let prevHref	= window.location.href;
	let prevTheme	= document.documentElement.getAttribute("data-theme");
	let bodyList	= document.querySelector("body");

	const updateTheme = () => {
		const currentTheme = document.documentElement.getAttribute("data-theme");
		sendMessageToGiscusIframe({
				setConfig: {
					theme: calcTheme(currentTheme),
				}
			});
		prevTheme = currentTheme;
	};

	setInterval(updateTheme, 500);

	let observer = new MutationObserver(
			(mutations) => {
				mutations.forEach((mutation) => {
					if (prevHref != document.location.href) {
						onLocationChange(prevHref, document.location.href);
						prevHref = document.location.href;
					}
					else
					{
						updateTheme();
					}
				});
			}
		);

	var config = {
		childList: true,
		subtree: true
	};

	observer.observe(bodyList, config);
});

})();
