import React, { Component } from 'react';
import { Button } from 'reactstrap';
import request from '../utilities/request';
import moment from 'moment';
import i18n from '../i18n';

class Gallery extends Component {
  constructor() {
    super();

    this.state = {
      token: undefined,
      url: undefined,
      loading: false,
      errors: undefined,
    };

    this.setToken = this.setToken.bind(this);
    this.validToken = this.validToken.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  setToken() {
    return request({
      url: '/api/blobToken'
    }).then(result => {
      return new Promise((resolve, reject) => {
        this.setState({ token: result.data.token }, () => {
          resolve(true);
        })
      });
    }).catch(error => {
      this.setState({
        errors: 'Failed to retrieve token',
        loading: false,
      });
      return false;
    });
  }

  validToken() {
    // Token doesn't exist
    if (!this.state.token) return false;
    // Token exists but is expired
    if (new Date(this.state.token.expiresAt) < (new Date()+10)) return false;
    return true;
  }

  async getImage() {
    this.setState({ loading: true, errors: false, url: undefined })

    if (!this.validToken()) {
      const token = await this.setToken();
      if (!token) return;
    }

    const containerName = 'iot-data'
    const filter = 'Huvudsta/' + moment().format('YYYYMMDD');
    const blobUri = "https://peliiot.blob.core.windows.net";
    const blobSAS = this.state.token.token;
    /* global AzureStorage */
    const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, blobSAS);
    blobService.listBlobsSegmentedWithPrefix(containerName, filter, null, {delimiter: "", maxResults : 10}, (error, result) => {
      if (error) {
        this.setState({ errors: "Couldn't list blobs for container", loading: false });
      } else {
        const blobURL = blobService.getUrl(containerName, result.entries[0].name, blobSAS);
        this.setState({ url: blobURL, loading: false });
      }
    });
  }

  render() {
    return (
      <div>
        <Button
          color="primary"
          onClick={this.getImage}
          disabled={this.state.loading}
          >
          {i18n.t('getImage')}
        </Button>
        <br/>
        {this.state.loading && <div>Loading...</div>}
        {this.state.errors && <div className='text-danger'>{this.state.errors}</div>}
        {this.state.url && <img width='400' src={this.state.url}/>}
      </div>
    );
  }
}

export default Gallery;
