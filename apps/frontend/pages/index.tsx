import { MainTemplate } from '../components/templates/MainTemplate';
import { Rides } from '../components/organisms/Rides';

export const Index = () => {

  return (
    <MainTemplate title="Taxi Fleets">
      <h1>Rides</h1>
      <Rides />
    </MainTemplate>
  );
}

export default Index;
