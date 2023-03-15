const API_URL = "https://programacion-web-2.herokuapp.com/api/podcast";

export const getFollowedPodcast = async (headers, page, query) => {
  headers["Content-Type"] = "application/json";

  let data = null;
  try {
    const response = await fetch(
      API_URL + `/followed/${page}${query ? "?query=" + query : ""}`,
      {
        method: "GET",
        headers,
      }
    );

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }

  return data;
};

export const getTopLikedPodcast = async (page, query) => {
  const headers = {
    "Content-Type": "application/json",
  };

  let data = null;
  try {
    const response = await fetch(
      API_URL + `/top/${page}${query ? "?query=" + query : ""}`,
      {
        method: "GET",
        headers,
      }
    );

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }

  return data;
};

export const getDiscoverPodcast = async (page, query) => {
  const headers = {
    "Content-Type": "application/json",
  };

  let data = null;
  try {
    const response = await fetch(
      API_URL + `/discover/${page}${query ? "?query=" + query : ""}`,
      {
        method: "GET",
        headers,
      }
    );

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

export const getPodcastsCreated = async (headers, page) => {
  headers["Content-Type"] = "application/json";

  let data = null;
  try {
    const response = await fetch(API_URL + `/created/${page}`, {
      method: "GET",
      headers,
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

export const getPodcastById = async (id) => {
  let data = null;
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "GET",
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

export const getCommentsByPodcastId = async (id, page) => {
  let data = null;
  try {
    const response = await fetch(`https://programacion-web-2.herokuapp.com/api/comment/podcast/${id}/page/${page}`, {
      method: "GET",
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};
export const insertComment = async (headers, comment, podcastId) => {
  headers["Content-Type"] = "application/json";

  let data = null;

  try {
    let body = JSON.stringify({
      textComment: comment,
    });

    const response = await fetch(API_URL + `/add_comment/${podcastId}`, {
      method: "PUT",
      headers,
      body,
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }

  return data;
};

export const updateComment = async (headers, comment, id) => {
  let data = null;
  headers["Content-Type"] = "application/json";
  let body = JSON.stringify({
    textComment: comment,
  });
  console.log(comment);
  try {
    const response = await fetch(`https://programacion-web-2.herokuapp.com/api/comment/${id}`, {
      method: "PUT",
      headers,
      body,
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};
export const updateViewsToPodcast = async (id) => {
  let data = null;
  try {
    const response = await fetch(API_URL + `/views_podcast/${id}`, {
      method: "PUT",
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

export const uploadNewPodcast = async (headers, podcastInfo) => {
  let data = null;

  try {
    let formData = new FormData();

    console.log(podcastInfo);

    formData.append("titlePodcast", podcastInfo.podcastTitle);
    formData.append("privacyPodcast", podcastInfo.podcastPrivacy);
    formData.append(
      "secondStartPreviewPodcast",
      podcastInfo.podcastStartPreviewSecond
    );
    formData.append(
      "secondEndPreviewPodcast",
      podcastInfo.podcastEndPreviewSecond
    );
    formData.append("imageFilePodcast", podcastInfo.podcastImage);
    formData.append("soundFileClipResponse", podcastInfo.podcastFile);

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: formData,
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }

  return data;
};

export const updateStatePodcast = async(id, headers, state) => {
  let data = null;

  let body = JSON.stringify({
    statePodcast: state,
  });

  headers["Content-Type"] = "application/json";

  try {
    const response = await fetch(API_URL + `/update_state/${id}`, {
      method: "PUT",
      body,
      headers
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }
  return data;

}

export const AddClipRequest = async (id, headers, clipRequestInfo) => {
  let data = null;

  try {
    let formData = new FormData();

    formData.append("titleClipRequest", clipRequestInfo.titleClipRequest);
    formData.append(
      "soundFileClipRequest",
      clipRequestInfo.soundFileClipRequest
    );
    formData.append(
      "secondStartPreviewClipRequest",
      clipRequestInfo.secondStartPreviewClipRequest
    );
    formData.append(
      "secondEndPreviewClipRequest",
      clipRequestInfo.secondEndPreviewClipRequest
    );

    const response = await fetch(API_URL + `/add_clip_request/${id}`, {
      method: "PUT",
      headers,
      body: formData,
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }

  return data;
};

export const AddClipResponse = async (id, headers, clipRequestInfo) => {
  let data = null;

  try {
    let formData = new FormData();

    formData.append(
      "soundFileClipResponse",
      clipRequestInfo.soundFileClipRequest
    );

    const response = await fetch(API_URL + `/add_clip_response/${id}`, {
      method: "PUT",
      headers,
      body: formData,
    });

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }

  return data;
};

export const ConvertClipRequestToResponse = async (
  podcastId,
  headers,
  clipRequestId
) => {
  headers["Content-Type"] = "application/json";
  let data = null;

  try {
    let body = JSON.stringify({
      clipRequestId: clipRequestId,
    });

    const response = await fetch(
      API_URL + `/clip_request_to_response/${podcastId}`,
      {
        method: "PUT",
        headers,
        body,
      }
    );

    data = await response.json();
    data.statusCode = response.status;
  } catch (error) {
    console.log("error", error);
  }

  return data;
};

export const votePodcast = async (headers, PodcastId) => {
  headers["Content-Type"] = "application/json"
  let data = null
  try {
      
      const response = await fetch(API_URL + '/likes_podcast/' + PodcastId, {
          method: 'PUT',
          headers
      })
      
      data = await response.json()
      data.statusCode = response.status
  } catch(error) {
      console.log('error', error)
  }
  return data
}