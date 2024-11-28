import Banner from "./components/Banner"
import Content from "./components/Content"
import NewNews from "./components/NewNews"
// import Search from "./components/Search"

const Home = () => {
  return <div className="max-w-screen-xl mx-auto">
    <Banner />
    {/* <Search /> */}
    <NewNews />
    <Content />
  </div>
}

export default Home