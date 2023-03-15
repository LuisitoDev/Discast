import ProfilePopup from "../UI/Popup/Popup";
import AvatarPlaceholder from "../../images/avatar_placeholder_user.png";

const PodcastStats = (props) => {
    return(
        <div className="row g-0 flex-nowrap fs-5 text-center text-nowrap podcast-row">
            <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl my-auto">
                <p className="p-2 my-auto">{props.views}</p>
            </div>
            <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl my-auto">
                <p className="m-0 p-2 my-auto">{props.comments}</p>
            </div>
            <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl my-auto">
                <p className="m-0 p-2 my-auto">{props.responses}</p>
            </div>
            <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl my-auto">
                <p className="m-0 p-2 my-auto">{props.requests}</p>
            </div>
            <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl my-auto">
                <p className="m-0 p-2 my-auto">{props.likes}</p>
            </div>
            <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl my-2 ">
                <ProfilePopup user={props.mostActiveUser}>
                    {<img src={props.mostActiveUser.imageFileUser ? (`https://programacion-web-2.herokuapp.com/api/file/${props.mostActiveUser.imageFileUser}`) : AvatarPlaceholder} alt="userImage" 
                    className={`${props.mostActiveUser.imageFileUser ? "profileImagePopup" : "profileImagePlaceholderPopup"}  img-fluid img-thumbnail`} style={{cursor:"pointer" }}/>}
                </ProfilePopup>
            </div>
        </div>
    )
}

export default PodcastStats