import CodeInput from '@pages/CodeInput';
import FormInputGroup from '@components/FormInputGroup';
import ConfirmPassword from '@pages/ConfirmPassword';
import Default from '@pages/Default';
import Finalize from '@pages/Finalize';
import GetInfo from '@pages/GetInfo';
import Home from '@pages/Home';
import Index from '@pages/Index';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route,
} from 'react-router-dom';
import Layout from '@layouts/Layout';
const Routes = createRoutesFromElements(
	<>
		<Route
			path='/'
			element={<Default />}
			errorElement={<Navigate to={'/'} />}
		/>
		<Route path='/business' element={<Layout />}>
			<Route index element={<Index />} />
			<Route path='home' element={<Home />}>
				<Route element={<GetInfo />}>
					<Route index element={<FormInputGroup />} />
					<Route
						path='confirm-password'
						element={<ConfirmPassword />}
					/>
				</Route>
			</Route>
		</Route>
		<Route path='/business/code-input' element={<CodeInput />} />
		<Route path='/business/finalize' element={<Finalize />} />
	</>,
);

const Router = createBrowserRouter(Routes);
export default Router;
