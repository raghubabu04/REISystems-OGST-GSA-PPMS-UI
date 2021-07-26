import React, {useState} from "react";
import {checkEmail} from "../../../../../../ui-kit/components/validations/FieldValidations";
import {PPMSModal} from "../../../../../../ui-kit/components/common/PPMS-modal";
import {UserApiService} from "../../../../../../api-kit/user/user-api.service";
import {PPMSInput} from "../../../../../../ui-kit/components/common/input/PPMS-input";
import {PPMSButton} from "../../../../../../ui-kit/components/common/PPMS-button";
import {PPMSToggleRadio} from "../../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import {PageHelper, Paths} from "../../../../../Router";

interface AddBidderModalProps {
  showModal: boolean;
  handleCloseModal: any;
  handleSaveModal: any;
}

const AddBidderModal = (props: AddBidderModalProps) => {
  const { showModal, handleCloseModal, handleSaveModal } = props;
  const [emailValidation, setEmailValidation] = useState({
    isInvalid: false,
    validationError: "",
  });
  const [email, setEmail] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [bidderUsername, setBidderUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [showBidder, setShowBidder] = useState(false);
  const [showBidderUserIds, setShowBidderUserIds] = useState(false);
  const [bidderUserId, setBidderUserIds] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [bidderUserIdsOptions, setBidderUserIdsOptions] = useState([]);

  let userService = new UserApiService();
  const handleEmailChange = (event) => {
    const emailInput = event.target.value.replace(/\s+/g, "");
    setEmail(emailInput);
    if (checkEmail(emailInput)) {
      setEmailValidation({ isInvalid: false, validationError: "" });
    } else {
      setEmailValidation({
        isInvalid: true,
        validationError: "Email is Invalid",
      });
      setShowBidder(false);
      setShowBidderUserIds(false);
      setBidderUserIdsOptions([]);
    }
  };
  const searchEmail = () => {
    if (!emailValidation?.isInvalid) {
      userService
        .getBidderUserIdsByEmailId(email)
        .then((response) => {
          console.log("User Options ",response.data);
          setShowBidderUserIds(true)
          if(response?.data?.length > 1) {
            console.log("User Options length ", response?.data?.length);
            let userIdOptions = response.data.map((userId) => {
              console.log("User Options each ", response?.data?.length);
              return {
                value: userId,
                id: userId,
                isSelected: false,
              };
            });
            console.log("User Options Options ", userIdOptions);
            setBidderUserIdsOptions(userIdOptions);
          }else if(response?.data?.length == 1){
            setShowBidderUserIds(false);
            setSelectedUserId(response.data?.[0]);
            //handleUserIdChange;
          }
        })
        .catch((error) => {
          setBidderName(null);
          setShowBidder(false);
          console.log(error);
        });
    }
  };
  const handleUserIdChange = (value) => {
    let selectedUserId = value
      .filter((item) => item.isSelected === true)
      .map((item) => {
        return item.value;
      });
    if (null != selectedUserId) {
      userService
        .getBidderUserByUserId(selectedUserId)
        .then((response) => {
          console.log("Response data ",response?.data);
          setShowBidder(true);
          let bidderDetails = response?.data ? response?.data : null;
          setBidderName(
            `${
              bidderDetails?.bidderFirstName ? bidderDetails.bidderFirstName : null
            } ${bidderDetails.bidderLastName}`
          );
          setRegistrationType(
            bidderDetails?.registrationType?.registrationType
              ? bidderDetails?.registrationType?.registrationType
              : null
          );
          setBidderUsername(
            bidderDetails?.userName ? bidderDetails?.userName : null
          );
          setUserId(bidderDetails?.bidderId?bidderDetails?.bidderId:null);
        })
        .catch((error) => {
          setBidderName(null);
          setShowBidder(false);
          console.log(error);
        });
    }
  };
  React.useEffect(() => {
    setEmail("");
    setBidderName("");
    setBidderUsername("");
    setRegistrationType("");
    setUserId("");
    setShowBidder(false);
    setEmailValidation({ isInvalid: false, validationError: "" });
  }, [showModal]);
  return (
    <div>
      <PPMSModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={() => handleSaveModal(userId)}
        title={"Add Bidder to Sale-Lot Group"}
        centered={true}
        backdrop={"static"}
        label={"Add"}
        labelCancel={"Cancel"}
        body={
          <AddBidderModalContent
            email={email}
            searchEmail={searchEmail}
            emailValidation={emailValidation}
            handleEmailChange={handleEmailChange}
            showBidder={showBidder}
            bidderName={bidderName}
            bidderRegistrationType={registrationType}
            bidderUsername={bidderUsername}
            showBidderUserIds={showBidderUserIds}
            bidderUserIdsOptions={bidderUserIdsOptions}
            handleUserIdChange={handleUserIdChange}
            setSelectedUserId={setSelectedUserId}
          />
        }
        id={"add-bidder-modal-window"}
        size={"lg"}
      />
    </div>
  );
};

const AddBidderModalContent = ({
  handleEmailChange,
  searchEmail,
  email,
  emailValidation,
  showBidder,
  bidderName,
  bidderRegistrationType,
  bidderUsername,
  showBidderUserIds,
  bidderUserIdsOptions,
  handleUserIdChange,
  setSelectedUserId
}) => {
  return (
    <div>
      <div className={"grid-row grid-gap-2"}>
        <div className={"grid-col-2 addBidder"}>
          <strong>Bidder Email : </strong>
        </div>
        <div className={"grid-col-6 "}>
          <PPMSInput
            title={"Bidder Email"}
            isDisabled={false}
            id={"bidder-email"}
            inputType={"text"}
            isInvalid={emailValidation.isInvalid}
            validationMessage={emailValidation.validationError}
            isRequired={true}
            value={email}
            maxLength={64}
            onChange={handleEmailChange}
          />
        </div>
        <div className={"grid-col-4 addBidder"}>
          <PPMSButton
            id={"search-bidder-email"}
            type={"button"}
            variant={"primary"}
            label={"Search"}
            onPress={searchEmail}
            className={""}
          />
        </div>
      </div>
      <br />
      <div className={"grid-row grid-gap-2 award-information-content_margin"}>
        {showBidderUserIds &&
        <PPMSToggleRadio
          id={"userId"}
          options={bidderUserIdsOptions}
          isInline={true}
          isDisabled={false}
          name={"userId"}
          className={"user-id grid-col-4"}
          isLabelNotRequired={false}
          validationMessage={""}
          isSingleSelect={true}
          onChange={(value) => {
            handleUserIdChange(value);
          }}
          isRequired={false}
          formClass={"grid-row-12"}
          inLineWithOutRightMargin={true}
        />
        }
      </div>
      <div className={"grid-row grid-gap-2"}>
        {showBidder ? (
          bidderName ? (
            <>
              <div className={"grid-col-4"}>
                <strong>Bidder Name</strong>
              </div>
              <div className={"grid-col-4"}>
                <strong>Bidder Registration Type</strong>
              </div>
              <div className={"grid-col-4"}>
                <strong>Bidder Username</strong>
              </div>
            </>
          ) : (
            <div>No Record Founds</div>
          )
        ) : (
          <></>
        )}
      </div>
      <div className={"grid-row grid-gap-2"}>
        {showBidder ? (
          <>
            <div className={"grid-col-4"}>{bidderName}</div>
            <div className={"grid-col-4"}>{bidderRegistrationType}</div>
            <div className={"grid-col-4"}>
              <PPMSButton
                id={"contract-transaction"}
                type={"button"}
                variant={"link"}
                className={"usa-link"}
                label={bidderUsername}
                onPress={() =>
                  PageHelper.openPage(
                    Paths.viewBidder +
                    `/${bidderUsername}`
                  )
                }
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default AddBidderModal;
