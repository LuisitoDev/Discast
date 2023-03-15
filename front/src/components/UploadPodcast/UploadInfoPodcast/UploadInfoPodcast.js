import { useEffect, useState } from 'react';

const UploadInfoPodcast = (props) => {

    const [srcImage, setSrcImage] = useState(
        "https://images.pexels.com/photos/6954162/pexels-photo-6954162.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    )

    const submitHandler = (e)=>{
        e.preventDefault();

        if(!props.podcastInfoData.podcastTitle){
            props.setValidations(old => {
                return {
                    ...old,
                    "isTitleValid": false,
                }
            });
        }
            
        if(!props.podcastInfoData.podcastImage){
            props.setValidations(old => {
                return {
                    ...old,
                    "isImageValid": false,
                }
            });
        }

        if(!props.podcastInfoData.podcastPrivacy){
            props.setValidations(old => {
                return {
                    ...old,
                    "isPrivacyValid": false,
                }
            });
        }

        if( props.podcastInfoData.podcastTitle && 
            props.podcastInfoData.podcastImage && 
            props.podcastInfoData.podcastPrivacy)
            props.setComponentState(false);
    }

    const fieldsHandler = (e) => {
        //Agarramos el input y su valor
        const input = e.target;
        let value = e.target.value;

        //Si el nombre de ese input es el input para la imagen y es de tipo archivo
        if(input.name === "podcastImage" && input.type === "file") {
            //Entonces sobreescribimos el valor de value al primer valor de la lista files
            [value] = e.target.files;
            // console.log(value);
            //Hacemos el proceso para setear el nuevo source en la etiqueta img
            const src = URL.createObjectURL(value);
            setSrcImage(src);
        };

        props.setPodcastInfoData(old => {
            return {
                ...old,
                [input.name]: value
            }
        });
    }

    return (
        <form onSubmit={submitHandler}  action="" method="post" encType="multipart/form-data">
            <div className="mb-3 mb-md-4">
                <label htmlFor="titleInputCreatePodcast" className="form-label">Título del podcast</label>
                <input type="text" name="podcastTitle" className="form-control w-100" id="titleInputCreatePodcast" onChange={fieldsHandler}/>
                { props.validations.isTitleValid === false &&
                    <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡Has olvidado poner un títutlo para tu podcast!</div>
                }
            </div>
            <div className="mb-3 mb-md-5 d-flex flex-column justify-content-center">
                <img className="podcastImage img-fluid rounded-3 mb-3 mb-md-4"
                    src={srcImage}
                    alt="" />
                <input type="file" name="podcastImage" id="podcastImageInput" className="d-none" accept="image/*"
                       onChange={fieldsHandler}/>
                <label htmlFor="podcastImageInput" className="btn btn-primary text-white mx-auto px-5 py-2">Subir foto</label>
                { props.validations.isImageValid === false &&
                    <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡Has olvidado subir una foto para tu podcast!</div>
                }
            </div>
            <div className="mb-3 mb-md-4 d-flex flex-column flex-md-row">
                <p className="col-md-6 align-self-md-center">
                    ¿Quién puede responder?
                </p>
                <select className="form-select mb-3" name="podcastPrivacy" aria-label=".form-select-lg example" onChange={fieldsHandler}>
                    <option value="public">Público</option>
                    <option value="only_friends">Solo Amigos</option>
                    <option value="only_me">Solo yo</option>
                </select>
                { props.validations.isPrivacyValid === false &&
                    <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> Elige una de las 3 opciones de privacidad</div>
                }
            </div>
            <div className="mb-3">
                <button type="submit" className="btn btn-primary text-white mx-auto d-block px-5 py-2">
                    Siguiente
                </button>
            </div>
        </form>
    );
}

export default UploadInfoPodcast;
