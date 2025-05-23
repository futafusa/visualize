import { Link } from 'react-router';
import routes from '../../routes';

interface RouteConfig {
  file?: string;
  path?: string;
  children?: RouteConfig[];
}

const navigationItems = [
  {
    path: '/visual/scanImage',
    label: 'Scan Image',
    thumbnail: '/images/thumbnails/scanimage.png',
    tags: ['Three.js', 'Shader']
  },
  {
    path: '/visual/destroyObject',
    label: 'Destroy Object',
    thumbnail: '/images/thumbnails/destroyObject.png',
    tags: ['Three.js', 'Destroy Object']
  },
  {
    path: '/visual/simpleCustomSlider',
    label: 'Simple Custom Slider',
    thumbnail: '/images/thumbnails/simpleCustomSlider.png',
    tags: ['Three.js', 'Shader']
  },
  // {
  //   path: '/visual/customSlide',
  //   label: 'Custom Slide',
  //   thumbnail: '/images/thumbnails/customSlide.png',
  //   tags: ['WIP', 'Three.js', 'Game']
  // },
  {
    path: '/visual/beltScroll',
    label: 'Belt Scroll',
    thumbnail: '/images/thumbnails/beltScroll.png',
    tags: ['Three.js', 'Game']
  },
  {
    path: '/visual/customPostProcessing',
    label: 'Custom Post Processing',
    thumbnail: '/images/thumbnails/customPostProcessing.png',
    tags: ['Three.js','Post Processing']
  },
  {
    path: '/visual/renderTarget',
    label: 'Render Target',
    thumbnail: '/images/thumbnails/renderTarget.png',
    tags: ['Three.js', 'Render Target']
  },
  {
    path: '/visual/raycasterUV',
    label: 'Raycaster UV',
    thumbnail: '/images/thumbnails/raycasterUV.png',
    tags: ['Three.js', 'Raycaster']
  },
  {
    path: '/visual/gamingTopdownView',
    label: 'Gaming Top-down View',
    thumbnail: '/images/thumbnails/gamingTopdownView.png',
    tags: ['Three.js','Game']

  },
  {
    path: '/visual/sampleVrm',
    label: 'Preview VRM',
    thumbnail: '/images/thumbnails/sampleVrm.png',
    tags: ['Three.js', 'VRM']
  },
  {
    path: '/visual/effectTest',
    label: 'Effect Test',
    thumbnail: '/images/thumbnails/effectTest.png',
    tags: ['Three.js', 'Shader']
  },
  {
    path: '/visual/manyCircle',
    label: 'Audio Reactive (Circle)',
    thumbnail: '/images/thumbnails/manyCircle.png',
    tags: ['Three.js', 'Audio']
  },
  {
    path: '/visual/studyGlsl',
    label: 'study GLSL',
    thumbnail: '/images/thumbnails/studyGlsl.png',
    tags: ['Three.js', 'Shader']
  },
  {
    path: '/visual/imageSlide',
    label: 'Custom Slide Image',
    thumbnail: '/images/thumbnails/imageSlide.png',
    tags: ['Three.js', 'Shader']

  },
  {
    path: '/visual/ballAttract',
    label: 'Ball Attract',
    thumbnail: '/images/thumbnails/ballAttract.png',
    tags: ['Three.js', 'Rapier']
  },
  {
    path: '/visual/sampleCustomShader',
    label: 'Sample CustomShader',
    thumbnail: '/images/thumbnails/sampleCustomShader.png',
    tags: ['Three.js', 'Shader']
  },
  {
    path: '/visual/sampleBufferGeometry',
    label: 'Sample Buffer Geometry',
    thumbnail: '/images/thumbnails/sampleBufferGeometry.png',
    tags: ['Three.js']
  },
  {
    path: '/visual/sampleAudio',
    label: 'Sample Audio Input',
    thumbnail: '/images/thumbnails/sampleAudio.png',
    tags: ['Three.js', 'Audio']
  },
  {
    path: '/visual/preRenderMovie',
    label: 'Prerender Movie',
    thumbnail: '/images/thumbnails/preRenderMovie.png',
    tags: ['Houdini']
  },
  {
    path: '/visual/preRenderImage',
    label: 'Prerender Image',
    thumbnail: '/images/thumbnails/preRenderImage.png',
    tags: ['Houdini']
  },
]

export function HomeNavigation() {
  // const navItems = getVisualRoutes(routes).reverse();

  return (
    <div className="">
      <nav>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-8">
          {navigationItems.map((item, index) => (
            <li
              key={index}
              className={`${item.tags.includes('WIP') && 'bg-orange-600'}`}
            >
              <Link to={item.path} className="group" viewTransition>
                <div className="w-full h-24 overflow-hidden relative">
                  <img
                    src={item.thumbnail} alt={item.label}
                    className={`
                      w-full h-full object-cover 
                      group-hover:sepia group-hover:scale-105
                      transition-all duration-300
                      ${item.tags.includes('WIP') && 'opacity-20'}
                    `}
                  />
                  <ul className="absolute bottom-2 left-2 flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <li key={index} className="text-xs text-black bg-white/80 px-1">{tag}</li>
                    ))}
                  </ul>
                </div>
                <h2 className="leading-tight pt-2 text-sm">{item.label}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}