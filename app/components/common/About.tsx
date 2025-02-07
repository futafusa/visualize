export default function About() {
  const linkList = [
    {
      name: 'X',
      url: 'https://x.com/futabarei',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/futabarei',
    },
    {
      name: 'BlueSky',
      url: 'https://bsky.app/profile/futabarei.bsky.social',
    },
    {
      name: 'sizu.me',
      url: 'https://sizu.me/futabarei',
    },
  ];

  return (
    <div className="p-4 mb-8 bg-white sm:p-8">
      <h3 className="pb-4">About</h3>
      <div className="flex justify-start gap-4 flex-col sm:flex-row">
        <div className="flex gap-4 sm:w-2/5">
          <div className="sm:w-1/2 max-w-[180px] w-1/3">
            <img src="/images/about/img_profile.jpg" alt="about" />
          </div>
          <div className="sm:w-1/2 max-w-[400px] w-2/3">
            <ul>
              <li>
                futaba rei
              </li>
              <li className="text-slate-500">
                designer/developer
              </li>
            </ul>
            <ul className="pt-4">
              {linkList.map((link) => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                    {link.name}
                    <span className="i-ic-round-launch text-slate-500"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="sm:w-3/5">
          <p className="text-slate-500">
            This site is a repository of visual expression ideas mainly using Three.js and Houdini.
          </p>
        </div>
      </div>
    </div>
  );
}
