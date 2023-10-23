import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import { TribePage } from './TribePage';

const Splash: React.FC = () => {
    return (
        <TribePage page='splash'>
            <TribeHeader />
            <TribeContent fullscreen>

            </TribeContent>
        </TribePage>
    );
};

export default Splash;
