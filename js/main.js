const { useState, useEffect } = React;
const endpoint = "https://jsonplaceholder.typicode.com/posts/";

const Request = ({ setPosts }) => {
  const getData = () => {
    fetch(endpoint)
      .then( response => response.json() )
      .then( data => setPosts(data))
      .then(console.log('fetched'))
      .catch(error => console.error(error));
  };

  return (
    <div className="button">
      <button id="request-button" onClick={getData}>
        Request names 
      </button>
    </div>
  )
}

const SortTitles = ({ posts, setPosts }) => {
  const sorted = posts.slice().sort( (a, b) => {
    if (a.title > b.title)
      return 1;
    if (b.title > a.title)
      return -1;
    else
      return 0;
  });

  return (
    <div className="button">
      <button id="sort-button" 
        onClick={() => setPosts( (prev) => sorted )}> 
        Sort titles
      </button>
    </div>
  )
}

const GroupByName = ({ posts, setPosts }) => {
  const sorted = posts.slice().sort( (a, b) => {
    if (a.userId > b.userId)
      return 1;
    if (b.userId > a.userId)
      return -1;
    else
      return 0;
  });

  return (
    <div className="button">
      <button id="group-button"
        onClick={() => setPosts( (prev) => sorted)}>
        Group by User
      </button>
    </div>
  )
}

const Post = ({ userId, postId, title, body, id }) => {
  const classes = `post post-group-${(userId % 2) + 1}`;

  return (
    <div className={ classes } key={id}>
      <div className="post-item post-userId">UserID: {userId}</div>
      <div className="post-item post-id">PostID: {postId}</div>
      <div className="post-item post-title">Title: {title}</div>
      <div className="post-item post-body">Body: {body}</div>
    </div>
  )
}

const Posts = ({ posts }) => {
  return (
    <div id="posts">
       {
         posts.map( (post, id ) =>
         <Post userId={post.userId}
           postId={post.id}
           title={post.title} 
           body={post.body} 
           key={id}/>
         )
       }
     </div>
  )
};

// Page 2 components

const PlayButton = ({ track, nowPlaying, setNowPlaying }) => {
  const play = async () => {
    console.log({ playing: tracks[track] });
    setNowPlaying( (status) => !status);
    let buffer = await buffers;
    playTrack(buffer[track]);
  }

  const stop = () => {
    setNowPlaying( (status) => !status); 
    stopTracks();
  }

  const action = nowPlaying ? stop : play;
  const isPlaying = nowPlaying ? "Stop": "Play";

  return (
    <div className="button play-button">
      <button onClick={action}>{isPlaying}</button>
    </div>
  )
}

const TrackSelect = ({ track, setTrack }) => {
  const trackName = trackNames[track];

  const changeTracks = (e) => {
    setTrack(parseInt(e.target.value));
  } 

  return (
    <div className="track-select">
      <select name="track-select" onChange={(e) => changeTracks(e)}>
      { 
        trackNames.map( (track, id) => 
        <option value={id} key={id}>{track} {id}</option>)
      }
      </select>
    </div>
  )

}

// Root components 
const Pages = () => {
  const [ page, setPage ] = useState(0);
  const [ posts, setPosts ] = useState([]);
  const [ track, setTrack ] = useState(0);
  const [ nowPlaying, setNowPlaying ] = useState(false);

  const totalPages = 2;
  const nextPage = (page + 1) % totalPages;
  const onClick = () => setPage(nextPage);

  const pages = [
    <div className="page">
      <Request setPosts={ setPosts } />
      <SortTitles posts={posts} setPosts={ setPosts } />
      <GroupByName posts={posts} setPosts={ setPosts } />
      <Posts posts={posts}/>
    </div>
    ,
    <div className="page">
      <TrackSelect track={track} setTrack={setTrack}/>
      <PlayButton track={track} nowPlaying={nowPlaying} setNowPlaying={setNowPlaying} />
    </div>
  ];

  return (
    <div className="root">
      <h1> Page {page + 1} </h1>
      <div className="page-button">
        <button id="next-page-button" onClick={onClick}>Next Page</button>
      </div>
      { pages[page] }
    </div>
  )
};

// Render to <div>
const domContainer = document.getElementById('main');
const root = ReactDOM.createRoot(domContainer); 

root.render(
  React.createElement(Pages)
);
