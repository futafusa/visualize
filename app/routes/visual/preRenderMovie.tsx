export default function PreRenderMovie() {
  const movieList = [
    {
      path: '/movie/vellum_sample011.mp4',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/movie/vellum_sample012b.mp4',
      tags: ['Houdini', 'Vellum', 'Karma']
    },
    {
      path: '/movie/light_sample007c.mp4',
      tags: ['Houdini','Lighting', 'Karma']
    },
    {
      path: '/movie/light_sample005d.mp4',
      tags: ['Houdini', 'Lighting', 'Karma']
    },
    {
      path: '/movie/light_sample001b.mp4',
      tags: ['Houdini', 'Lighting', 'Karma']
    },

  ]
  return (
    <div>

      <div className="mx-auto px-4 md:w-5/6 pb-24">
        <h1 className="text-2xl mt-24 mb-8">
          PreRender Movie
        </h1>

        <ul className="columns-1 sm:columns-2 gap-8 space-y-8">
          {movieList.map((movie, index) => (
            <li key={index} className="mb-4 relative">
              <video controls loop>
                <source src={movie.path} type="video/mp4" />
              </video>

              <ul className="flex flex-wrap gap-2 mt-2 absolute top-2 left-4">
                {movie.tags.map((tag, index) => (
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
