import Page from 'Components/Page';

class AboutPage extends Page {
  constructor(props) {
    super(props);

    this.title = 'About Page';
  }

  setContent() {
    this.content = `
      <div class="row">
        <div class="jumbotron">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit similique doloremque reiciendis vitae. Molestiae maxime excepturi error, et, fuga hic explicabo deleniti atque unde beatae quidem sequi? Architecto, id accusantium.Eligendi rem porro eaque voluptatem doloribus quam, adipisci repudiandae iure ab saepe sit blanditiis inventore, expedita ipsum nobis dicta officia? Fugiat quas officia atque laudantium quasi molestias laboriosam esse voluptas.</p>
        </div>
      </div>`;
  }
}

export default AboutPage;
