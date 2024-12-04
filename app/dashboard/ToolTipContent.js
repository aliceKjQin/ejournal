export const TooltipContent = (
  <div className="p-4 bg-yellow-200 rounded-3xl">
    <p>
      When answering, &ldquo;I am grateful for...,&rdquo; consider four
      categories to avoid going on autopilot and repeating the same items (e.g.,
      &ldquo;my healthy family,&rdquo; or &ldquo;my loving dog&rdquo;). This
      repetition can defeat the purpose. Here are the categories to reflect on
      each day:
    </p>

    <ul
      style={{ paddingLeft: "20px", margin: "10px 0" }}
    >
      <li style={{ marginBottom: '5px' }}><span><i className="fa-solid fa-square-check text-emerald-500 mr-1"></i></span>An old relationship that helped or meant a lot to you.</li>
      <li style={{ marginBottom: '5px' }}><span><i className="fa-solid fa-square-check text-emerald-500 mr-1"></i></span>
        An opportunity you have today, whether it&rsquo;s something small like
        calling a parent or going to work.
      </li>
      <li style={{ marginBottom: '5px' }}><span><i className="fa-solid fa-square-check text-emerald-500 mr-1"></i></span>
        Something great that happened yesterday, whether you experienced or
        witnessed it.
      </li>
      <li style={{ marginBottom: '5px' }}><span><i className="fa-solid fa-square-check text-emerald-500 mr-1"></i></span>
        Something simple near you, such as a beautiful cloud, your coffee, or
        the pen you&rsquo;re using. Simple, concrete things can bring more
        presence into your gratitude practice.
      </li>
    </ul>
    <p style={{ textAlign: 'center' }}>Reference: Tim Ferriss, <span style={{ fontStyle: 'italic' }}>Tools of Titans</span></p>
  </div>
);
