const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto pt-20 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-semibold">Git Journal</h1>

        <h2 className="text-3xl mt-6">Your Life, Your Journal</h2>

        <div className="mt-5">
          <wired-button elevation="3">
            <p className="capitalize text-lg px-3">Create Your Journal</p>
          </wired-button>
        </div>

        <div className="flex wired-card-container mt-20 space-x-5 text-left">
          <div className="w-full">
            <wired-card>
              <div className="text-left">
                <img src="/images/user.png" alt="User" />
                <h2 className="ml-3 text-lg">John</h2>
              </div>

              <p className="ml-3 mt-5 mb-3">
                Dear Diary, <br />
                Today, I confidently walked into a glass door, thinking it was
                open. My attempt to play it cool failed miserably as everyone
                burst into laughter. I'll never live this down. Note to self:
                Practice your superhero vision skills or get a neon sign that
                says, "This is a door!"
              </p>
            </wired-card>
          </div>
          <div className="w-full">
            <wired-card>
              <div className="text-left">
                <img src="/images/user.png" alt="User" />
                <h2 className="ml-3 text-lg">Emily</h2>
              </div>

              <p className="ml-3 mt-5 mb-3">
                Dear Diary, <br />
                Guess what happened during my presentation? I accidentally
                called my boss "mom" in front of the entire team. The room fell
                silent, and my cheeks turned crimson. I tried to recover, but
                let's just say, "Oops! Freudian slip!" Now, every meeting is
                filled with suspicious parental glances.
              </p>
            </wired-card>
          </div>
          <div className="w-full">
            <wired-card>
              <div className="text-left">
                <img src="/images/user.png" alt="User" />
                <h2 className="ml-3 text-lg">Alex</h2>
              </div>

              <p className="ml-3 mt-5 mb-3">
                Dear Diary, <br />
                Today, I thought I was being super sneaky and discreetly
                adjusted my underwear in public. Little did I know, I was on a
                live video conference! My colleague's horrified expressions gave
                it away. Now, my nickname at the office is "Captain Underpants."
                Time to start a new job in disguise.
              </p>
            </wired-card>
          </div>
        </div>

        <p className="mt-5 text-gray-500">
          Don't get yourself embarrassed by leaking out journal entries like
          these 😉
        </p>
      </div>
    </div>
  );
};

export default Hero;
