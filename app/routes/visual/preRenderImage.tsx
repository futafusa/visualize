export default function PreRenderImage() {
  const imageList = [
    {
      path: '/images/prerender/mardini_day11_b.png',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_010.png',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_011.png',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_012.png',
      tags: ['Houdini', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_014.png',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/view004d.png',
      tags: ['Houdini', 'Karma']
    },
    {
      path: '/images/prerender/FgxZiIUaUAAel8t.jpg',
      tags: ['Houdini', 'Karma']
    },
  ]
  return (
    <div>
      <div className="mx-auto px-4 md:w-5/6 pb-24">
        <h1 className="text-2xl mt-24 mb-8">
          PreRender Image
        </h1>
        <ul className="columns-1 sm:columns-2 gap-8 space-y-8">
          {imageList.map((image, index) => (
            <li key={index} className="mb-4 relative">
              <img src={image.path} alt={image.path} />
              <ul className="flex flex-wrap gap-2 mt-2 absolute top-2 left-4">
                {image.tags.map((tag, index) => (
                  <li key={index} className="text-sm text-black bg-white/80 px-2 py-1">
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
