import * as React from "react";
import Svg, { Path, Rect, Defs, G, ClipPath } from "react-native-svg";

function FertilitySvgIcon(props) {
  const { height = 25, width = 25 } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
      <G clipPath="url(#clip0)">
        <Path
          d="M19.727 11.7392C19.7159 11.6924 19.6978 11.6483 19.6737 11.6082C19.4783 11.1401 19.2402 10.6891 18.9604 10.2623L18.7024 9.86865C18.6891 9.84835 18.6741 9.82988 18.6584 9.81235C18.7357 9.64343 18.7791 9.45591 18.7791 9.25836C18.7791 8.15971 17.8854 7.26593 16.7867 7.26593H15.6835C15.9496 6.89656 16.1069 6.44388 16.1069 5.95492C16.1069 5.28556 15.8213 4.64508 15.3233 4.19774L10.7945 0.129821C10.6019 -0.0431684 10.3055 -0.0273697 10.1325 0.165309C9.9595 0.357895 9.97534 0.654321 10.168 0.827357L14.6967 4.89523C14.997 5.16498 15.1693 5.55123 15.1693 5.95492C15.1693 6.67777 14.5812 7.26589 13.8583 7.26589H13.8098C13.7835 7.26589 13.7572 7.26809 13.7314 7.2725L9.0585 8.06525C9.05461 8.0659 9.04654 8.06726 9.03721 8.05943C9.02793 8.05161 9.02793 8.0434 9.02793 8.03946V2.99976C9.02793 2.74083 8.81805 2.53095 8.55913 2.53095C8.3002 2.53095 8.09032 2.74083 8.09032 2.99976V8.03942C8.09032 8.32379 8.21493 8.59219 8.43217 8.77568C8.64942 8.95921 8.93492 9.03708 9.21527 8.98959L13.8493 8.2035H16.7867C17.3684 8.2035 17.8415 8.67666 17.8415 9.25831C17.8415 9.47804 17.6628 9.6568 17.443 9.6568H13.9036C13.8424 9.6568 13.7819 9.66875 13.7253 9.692L8.69241 11.7611C7.95605 12.0639 7.11553 12.0541 6.38635 11.7344C5.31405 11.2642 4.62121 10.2039 4.62121 9.03305V1.9215C4.62121 1.66258 4.41132 1.4527 4.1524 1.4527C3.89348 1.4527 3.68359 1.66258 3.68359 1.9215V9.03305C3.68359 10.4508 4.45478 11.745 5.67602 12.4265V14.2222C5.67602 14.5954 5.61629 14.9642 5.49853 15.3183C4.64216 17.8935 4.57076 20.6374 5.29193 23.2536L5.40341 23.6581C5.46074 23.866 5.64939 24.0024 5.8551 24.0024C5.89636 24.0024 5.93827 23.9969 5.97999 23.9854C6.22958 23.9166 6.37613 23.6585 6.30736 23.4089L6.19588 23.0044C5.52422 20.568 5.59074 18.0125 6.38827 15.6142C6.53782 15.1645 6.61368 14.6962 6.61368 14.2222V12.7992C6.92721 12.8783 7.24924 12.9186 7.5714 12.9186C8.07462 12.9186 8.57797 12.8219 9.04898 12.6283L13.9961 10.5944H17.443C17.6348 10.5944 17.8172 10.5534 17.9823 10.4803L18.1762 10.7763C18.4213 11.1503 18.6285 11.5392 18.7988 11.9381C18.7524 12.5679 18.2255 13.0663 17.5841 13.0663C16.5561 13.0663 15.6943 13.7897 15.4799 14.754C15.4504 14.7539 15.421 14.7546 15.3915 14.757C15.116 14.7789 14.7061 14.9177 14.3172 15.4547C14.2562 15.5389 14.1371 15.5773 13.993 15.5863C14.3352 15.2035 14.5438 14.6988 14.5438 14.146C14.5438 12.9532 13.5733 11.9826 12.3804 11.9826C11.1875 11.9826 10.2171 12.9532 10.2171 14.146C10.2171 14.5274 10.3166 14.8857 10.4905 15.1971C10.4851 15.2146 10.4803 15.2325 10.4769 15.251C10.4717 15.2789 10.3511 15.9454 10.5157 16.7399C10.7404 17.8251 11.3805 18.6385 12.3668 19.0919C13.0805 19.4201 13.7068 19.556 14.2445 19.556C15.3217 19.5559 16.0425 19.01 16.3938 18.3707C16.4249 18.4113 16.4525 18.456 16.4632 18.4861C16.5522 18.8056 16.8821 18.9878 17.2859 18.9397C17.7933 18.879 18.3493 18.4679 18.371 17.7084C18.3887 17.0892 18.0087 16.3918 17.4254 15.9731C17.1453 15.772 16.8485 15.6584 16.5548 15.6344C16.5187 15.4601 16.4504 15.3089 16.3664 15.1936C16.3817 14.535 16.9219 14.0038 17.5841 14.0038C18.2374 14.0038 18.8233 13.7114 19.2191 13.2509C19.7289 15.5776 19.0858 18.064 17.3628 19.8827C16.7645 20.5141 16.4351 21.341 16.4351 22.2108V23.5334C16.4351 23.7924 16.6449 24.0023 16.9039 24.0023C17.1628 24.0023 17.3727 23.7924 17.3727 23.5334V22.2109C17.3727 21.5819 17.6109 20.9841 18.0434 20.5275C19.3243 19.1755 20.121 17.4093 20.2867 15.5543C20.4028 14.2548 20.206 12.9436 19.727 11.7392ZM12.3805 12.9203C13.0563 12.9203 13.6062 13.4702 13.6062 14.1461C13.6062 14.822 13.0564 15.3718 12.3805 15.3718C11.7046 15.3718 11.1547 14.822 11.1547 14.1461C11.1547 13.4702 11.7046 12.9203 12.3805 12.9203ZM16.423 16.5685C16.6072 16.5642 16.7802 16.6642 16.8786 16.7348C17.1986 16.9645 17.4425 17.3804 17.4339 17.6817C17.4306 17.7952 17.3976 17.8783 17.3327 17.9357C17.3086 17.9571 17.2828 17.9728 17.2583 17.9841C17.109 17.7175 16.8271 17.3979 16.4356 17.3564C16.2726 17.3392 15.8634 17.3567 15.5865 17.8922C15.2535 18.5358 14.3358 18.9652 12.7585 18.24C11.6474 17.7292 11.4012 16.72 11.3683 16.0573C11.6705 16.2179 12.015 16.3094 12.3805 16.3094C12.503 16.3094 12.6232 16.2986 12.7403 16.2789C12.9683 16.3729 14.4135 16.9203 15.0766 16.0046C15.2124 15.8172 15.3578 15.7002 15.4658 15.6916C15.5283 15.6869 15.58 15.7208 15.6143 15.7531C15.6329 15.7851 15.6752 15.9097 15.6119 16.0841C15.467 16.4832 14.8901 16.8472 14.029 17.0831C13.7793 17.1515 13.6323 17.4093 13.7007 17.659C13.7577 17.8673 13.9465 18.0041 14.1525 18.0041C14.1936 18.0041 14.2352 17.9987 14.2766 17.9874C15.6053 17.6235 16.1821 17.0582 16.423 16.5685Z"
          fill="black"
          stroke="black"
          stroke-width="0.3"
        />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Rect width="24.003" height="24.003" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default FertilitySvgIcon;
