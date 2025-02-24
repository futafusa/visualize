import SimpleFloor from "./simpleFloor";
import PickupObject from "./pickupObject";

export default function BaseEnviroment() {
  return (
    <>
      <SimpleFloor />
      <PickupObject
        position={[-2, 1, 2]}
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
        position={[-7, 1, -2]}
        rotation={[0, 0, 0]}
        size={[0.2, 0.2, 0.2]}
        coliderSize={8}
        color="blue"
        modalContent={{
          image: '/images/prerender/view004d.webp',
          text: '一週間に一度しか開かない。中身はおいしい。',
        }}
      />
      <PickupObject
        position={[4, 1, -2]}
        rotation={[0, 0, 0]}
        size={[0.2, 0.2, 0.2]}
        coliderSize={8}
        color="green"
        modalContent={{
          image: '/images/prerender/vellum_sample_012.webp',
          text: '遠い海が見えたと思ったのに。',
        }}
      />
    </>
  );
}
