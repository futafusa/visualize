import SimpleFloor from "./simpleFloor";
import PickupObject from "./pickupObject";

export default function BaseEnviroment() {
  return (
    <>
      <SimpleFloor />
      <PickupObject
        position={[1, 1, 4]}
        rotation={[0, 0, 0]}
        size={[0.2, 0.2, 0.2]}
        coliderSize={8}
        color="red"
        modalContent={{
          image: '/images/prerender/vellum_sample_010.webp',
          text: 'ゴミカス。二度と使えない。',
        }}
      />
      <PickupObject
        position={[-1, 1, 8]}
        rotation={[0, 0, 0]}
        size={[0.2, 0.2, 0.2]}
        coliderSize={8}
        color="blue"
        modalContent={{
          image: '/images/prerender/view004d.webp',
          text: '一週間に一度しか開かない。中身はおいしい。',
        }}
      />
    </>
  );
}
