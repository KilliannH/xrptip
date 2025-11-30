import api from './client';

export const uploadAPI = {
  /**
   * Upload avatar image to S3
   * @param {FormData} formData - FormData with 'avatar' file
   * @returns {Promise}
   */
  uploadAvatar: (formData) => {
    return api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Upload banner image to S3
   * @param {FormData} formData - FormData with 'banner' file
   * @returns {Promise}
   */
  uploadBanner: (formData) => {
    return api.post('/upload/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Delete image from S3
   * @param {string} key - S3 object key
   * @returns {Promise}
   */
  deleteImage: (key) => {
    return api.delete(`/upload/${key}`);
  }
};