import React, { Component } from 'react';
import {
  Button,
  ButtonGroup,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import request from '../utilities/request';
import moment from 'moment';
import i18n from '../i18n';
import auth from '../utilities/auth';

class Gallery extends Component {
  constructor() {
    super();

    this.state = {
      activeIndex: 0,
      slides: [],
      loading: false,
      errors: undefined,
    };

    this.setToken = this.setToken.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getImages = this.getImages.bind(this);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    const { activeIndex, slides } = this.state;
    if (this.animating || slides.length === 0) return;

    if (activeIndex === slides.length - 1) {
      const lastDate = slides.slice(-1)[0].date;
      const date = moment(lastDate).subtract(1, "days");
      this.getImages(date, activeIndex + 1);
    } else {
      this.setState({ activeIndex: activeIndex + 1 });
    }
  }

  previous() {
    const { activeIndex, slides } = this.state;
    if (this.animating || activeIndex === 0 || slides.length === 0) return;
    this.setState({ activeIndex: this.state.activeIndex - 1 });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  setToken() {
    return request({
      url: '/api/blobToken'
    }).then(result => {
      const token = result.data.token;
      auth.setBlobToken(token);
      return token;
    }).catch(error => {
      this.setState({
        errors: 'Failed to retrieve token',
        loading: false,
      });
      return false;
    });
  }

  getToken() {
    const token = auth.getBlobToken();
    // Token doesn't exist
    if (!token)
      return false;

    // Token exists but is expired
    if (new Date(token.expiresAt) < (new Date()+10)) return false;
    return token;
  }

  async getImages(date = undefined, nextIndex = undefined) {
    this.setState({ loading: true, errors: false })
    let token = this.getToken();

    if (!token) {
      token = await this.setToken();
      if (!token) return;
    }

    const containerName = 'iot-data'
    const filter = 'Huvudsta/' + moment(date).format('YYYYMMDD');
    const blobUri = "https://peliiot.blob.core.windows.net";
    const blobSAS = token.token;
    /* global AzureStorage */
    const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, blobSAS);
    blobService.listBlobsSegmentedWithPrefix(containerName, filter, null, {delimiter: "", maxResults : 10}, (error, result) => {
      if (error) {
        this.setState({ errors: "Couldn't list blobs for container", loading: false });
      } else {
        let slides = [];
        if (Array.isArray(result.entries) && result.entries.length > 0) {
          slides = result.entries.map(entry => ({
            url: blobService.getUrl(containerName, entry.name, blobSAS),
            date: entry.lastModified,
          }));
        } else {
          slides = [{
            date: moment(date).format('dddd, DD MMM YYYY'),
            header: i18n.t('imageMissing'),
          }];
        }
        const state = { slides: this.state.slides.concat(slides), loading: false };
        this.setState({ slides: this.state.slides.concat(slides), loading: false }, () => {
          if (nextIndex) this.setState({ activeIndex: nextIndex });
        });
      }
    });
  }

  render() {
    return (
      <div className='blob-gallery'>
        <ButtonGroup className='btn-group-block'>
          <Button
            color="primary"
            onClick={this.getImages}
            disabled={this.state.loading || this.state.slides.length > 0}
            >
            {i18n.t('getTodaysImage')}
          </Button>
        </ButtonGroup>
        {this.state.errors && <div className='text-danger'>{this.state.errors}</div>}
        <Carousel
          activeIndex={this.state.activeIndex}
          next={this.next}
          previous={this.previous}
          interval={false}
        >
          {this.state.slides.map(slide =>
            <CarouselItem
              onExiting={this.onExiting}
              onExited={this.onExited}
              key={slide.url}
            >
              {slide.url ? <img src={slide.url}/> : <div className='no-image'><div className="content"></div></div>}
              <CarouselCaption captionText={slide.date} captionHeader={slide.header || 'Huvudsta'} />
            </CarouselItem>
          )}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
      </div>
    );
  }
}

export default Gallery;
