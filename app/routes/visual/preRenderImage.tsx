export default function PreRenderImage() {
  const imageList = [
    {
      path: '/images/prerender/mardini_day11_b.webp',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_010.webp',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_011.webp',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_012.webp',
      tags: ['Houdini', 'Karma']
    },
    {
      path: '/images/prerender/vellum_sample_014.webp',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/images/prerender/view004d.webp',
      tags: ['Houdini', 'Karma']
    },
    {
      path: '/images/prerender/FgxZiIUaUAAel8t.webp',
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
              <img src={image.path} alt={image.path} loading="lazy" />
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
