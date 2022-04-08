import * as React from "react";
import Svg, { Path, Rect, Defs, G, ClipPath } from "react-native-svg";

function MentalHealthSvgIcon(props) {
  const { height = 24, width = 24 } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clip-path="url(#clip0)">
        <Path
          d="M19.6632 19.5271C19.6048 19.3419 19.4073 19.2391 19.2222 19.2975C19.037 19.3559 18.9342 19.5533 18.9926 19.7385C19.0881 20.0415 19.1989 20.3631 19.3218 20.6945C19.3814 20.8549 19.3705 21.0265 19.2915 21.1777C19.2128 21.3283 19.079 21.4345 18.9145 21.4769L11.9267 23.2781C11.6403 23.352 11.3406 23.2012 11.2296 22.9276C10.8126 21.9006 9.83659 19.4952 7.3533 19.8319C7.17916 19.8555 7.00548 19.8799 6.83439 19.9039C5.98771 20.0229 5.11231 20.1458 4.7186 20.0814C3.8843 19.9448 3.42633 19.5992 3.27731 18.9939C3.18159 18.6096 3.30018 18.3293 3.46326 18.0645C3.64697 17.736 3.49364 17.3478 3.24632 17.1767C3.08085 17.0621 2.89639 16.9876 2.76196 16.9434C2.75839 16.8674 2.7943 16.752 2.97618 16.6209C3.05329 16.5653 3.10457 16.4809 3.11835 16.3868C3.13218 16.2928 3.10734 16.1971 3.04944 16.1218C3.05184 16.0999 2.72788 15.7747 2.37645 15.4709C2.66773 15.264 3.22364 14.7954 3.15145 14.2771C3.12121 14.0603 2.97233 13.7671 2.43448 13.6017C1.84577 13.4207 1.76416 13.193 1.76364 12.9739C1.76312 12.7504 1.89578 12.6122 2.21332 12.3677C2.71522 11.9814 3.2887 11.4788 3.73688 10.681C3.88646 10.4146 3.90432 10.0894 3.78469 9.81082C3.71377 9.64582 3.61528 9.48981 3.52003 9.33901C3.37368 9.10721 3.22232 8.86744 3.25753 8.71632C3.2767 8.634 3.32854 8.52445 3.38854 8.39756C3.53405 8.0901 3.73327 7.66902 3.77499 7.02911C3.79018 6.79563 3.81661 6.56387 3.85351 6.34042C3.8851 6.14883 3.75539 5.96794 3.56381 5.9363C3.37214 5.90503 3.19134 6.03446 3.1597 6.22599C3.1191 6.47214 3.09009 6.727 3.0733 6.98336C3.0403 7.48953 2.88763 7.81222 2.75295 8.0969C2.67889 8.25346 2.60891 8.40131 2.57267 8.55689C2.47081 8.99434 2.71231 9.37694 2.92541 9.71444C3.00988 9.84818 3.08962 9.97446 3.13865 10.0885C3.17245 10.1672 3.16692 10.2599 3.12384 10.3367C2.81253 10.8908 2.4245 11.3179 1.78441 11.8106C1.4956 12.0329 1.05919 12.3689 1.06055 12.9755C1.06196 13.5992 1.45468 14.0361 2.2278 14.2738C2.3779 14.3199 2.43561 14.3649 2.45342 14.3821C2.4319 14.4998 2.16101 14.7749 1.88922 14.9522C1.85092 14.977 1.81778 15.0092 1.79172 15.0467C1.63548 15.2716 1.55903 15.7307 1.98869 16.0733C2.10583 16.1667 2.2016 16.2519 2.27698 16.3236C1.95958 16.7322 2.04147 17.1865 2.20957 17.433C2.3396 17.6095 2.55233 17.5715 2.83494 17.7473C2.68231 18.0148 2.42928 18.4637 2.59456 19.162C2.8131 20.0499 3.48951 20.5927 4.60502 20.7753C5.10425 20.857 5.95139 20.738 6.93217 20.6003C7.10223 20.5764 7.27478 20.5522 7.44776 20.5287C9.1546 20.2978 9.96096 21.6721 10.5781 23.1921C10.7795 23.6884 11.2643 23.9998 11.7809 23.9998C11.8874 23.9998 11.9952 23.9866 12.1022 23.959L19.09 22.1578C19.4445 22.0664 19.7451 21.8279 19.9147 21.5035C20.0846 21.1783 20.1089 20.7944 19.9811 20.45C19.8622 20.1295 19.7552 19.819 19.6632 19.5271Z"
          fill="black"
          stroke="black"
          stroke-width="0.5"
        />
        <Path
          d="M19.2347 1.95528C17.2915 0.712653 14.6203 0 11.9059 0C10.0839 0 8.36826 0.39371 6.94474 1.13866C5.41659 1.93827 4.27549 3.1247 3.64468 4.56969C3.56701 4.74768 3.64829 4.95492 3.82623 5.03259C4.00422 5.11007 4.21141 5.02898 4.28913 4.85104C5.40599 2.29251 8.32453 0.703137 11.9059 0.703137C14.4897 0.703137 17.0229 1.37543 18.8559 2.54765C21.0679 3.96218 22.2371 6.07126 22.2371 8.64695C22.2371 11.8392 21.8175 13.1471 19.0395 15.6612C18.5412 16.1121 18.3932 16.911 18.5873 18.1036C18.6154 18.2762 18.7645 18.3988 18.9339 18.3988C18.9526 18.3988 18.9717 18.3973 18.9907 18.3942C19.1824 18.363 19.3125 18.1823 19.2813 17.9908C19.1329 17.0783 19.2124 16.4529 19.5113 16.1825C22.4446 13.5278 22.9402 11.9726 22.9402 8.64695C22.9402 5.8194 21.6588 3.50542 19.2347 1.95528Z"
          fill="black"
          stroke="black"
          stroke-width="0.5"
        />
        <Path
          d="M7.02189 12.0446C7.14902 12.0647 7.2768 12.0746 7.40393 12.0746C7.865 12.0746 8.31824 11.9441 8.70928 11.702C8.98842 12.3196 9.56364 12.7888 10.2714 12.9009C10.4698 12.9323 10.6688 12.9351 10.8654 12.909C10.9522 12.9971 11.0483 13.0741 11.151 13.1405L12.2527 15.8431C12.3977 16.1988 12.7234 16.4571 13.1029 16.5172L14.2492 16.6988C14.2858 16.7046 14.3223 16.7074 14.3584 16.7074C14.5558 16.7074 14.7436 16.6228 14.8759 16.4705C15.0325 16.2901 15.084 16.0462 15.0138 15.8179L14.6049 14.4871C14.7118 14.5064 14.8247 14.5161 15.0327 14.5084C15.3545 14.8315 15.7711 15.0453 16.2249 15.1172C16.3394 15.1354 16.4539 15.1443 16.5677 15.1443C17.0203 15.1443 17.4602 15.0022 17.8335 14.731C18.3006 14.3917 18.6075 13.8908 18.6978 13.3207C18.7081 13.2556 18.7149 13.1899 18.7193 13.1242C18.8984 13.0409 19.0708 12.9398 19.2341 12.8211C19.8968 12.3396 20.3322 11.629 20.4603 10.8201C20.5669 10.1469 20.4481 9.46663 20.1251 8.87463C20.4821 8.49213 20.7191 8.00973 20.8016 7.48884C20.9118 6.79321 20.7445 6.09631 20.3305 5.52653C19.9573 5.01282 19.4239 4.65787 18.8121 4.51209C18.4939 3.60087 17.7003 2.93041 16.7351 2.77754C16.086 2.67456 15.4319 2.8164 14.8892 3.16854C14.4949 2.67353 13.9576 2.31338 13.3438 2.13863C13.157 2.08519 12.9625 2.19371 12.9094 2.38046C12.8561 2.56717 12.9645 2.7617 13.1512 2.81486C13.7186 2.97644 14.2013 3.3446 14.5103 3.85147C14.5644 3.94025 14.6551 4.00049 14.7578 4.01605C14.861 4.03175 14.965 4.00091 15.043 3.93219C15.4773 3.54931 16.0539 3.38168 16.6251 3.47201C17.3882 3.5929 18.005 4.15499 18.1965 4.90402C18.2315 5.04104 18.3453 5.14369 18.4851 5.16465L18.4997 5.16652C19.0098 5.24738 19.4579 5.52198 19.7615 5.93983C20.0651 6.35769 20.1879 6.86877 20.107 7.37887C20.0349 7.83423 19.8016 8.24955 19.4502 8.54838C19.3135 8.66463 19.2863 8.86521 19.3871 9.01372C19.7256 9.51233 19.8601 10.1147 19.7657 10.7101C19.667 11.3335 19.3313 11.8812 18.8207 12.2522C18.31 12.6232 17.6853 12.7732 17.062 12.6744C16.6832 12.6144 16.3307 12.4659 16.0273 12.2412C16.1087 12.1068 16.1773 11.9623 16.2305 11.8085C16.2939 11.625 16.1965 11.4248 16.013 11.3614C15.8294 11.2981 15.6293 11.3955 15.5659 11.5789C15.3205 12.2895 14.6021 12.72 13.8591 12.602C13.6354 12.5665 13.4269 12.4848 13.2395 12.3592C13.0984 12.2646 12.9097 12.2845 12.7914 12.4064C12.5649 12.6399 12.2387 12.7489 11.9182 12.6983C11.6625 12.6578 11.4355 12.5216 11.2789 12.3148C11.1945 12.2032 11.0521 12.1521 10.9158 12.1852C10.7405 12.2277 10.5606 12.2348 10.3812 12.2064C9.68097 12.0955 9.17677 11.4555 9.2334 10.7496C9.24732 10.5762 9.13238 10.4187 8.96297 10.3791C8.61567 10.298 8.37698 9.98015 8.39545 9.62348C8.40759 9.38821 8.52721 9.17825 8.72358 9.04737C8.88516 8.93965 8.92885 8.7214 8.82117 8.55986C8.7135 8.39828 8.4952 8.35469 8.33366 8.46227C7.95603 8.71394 7.71668 9.13447 7.69325 9.58719C7.66235 10.1854 8.00174 10.7276 8.52792 10.9696C8.13791 11.2917 7.6376 11.4302 7.13167 11.3501C6.17044 11.1978 5.51225 10.2919 5.66446 9.33074C5.70796 9.05647 5.81184 8.80352 5.97318 8.57885C6.05189 8.4693 6.06094 8.32436 5.99648 8.20586C5.77696 7.80207 5.69896 7.34845 5.77087 6.89408C5.90868 6.02398 6.58384 5.33481 7.45085 5.17909C7.59509 5.15316 7.70815 5.04047 7.73454 4.89628C7.89941 3.9943 8.77036 3.37732 9.67614 3.52062C9.86772 3.5509 10.0511 3.61306 10.2213 3.70522C10.3714 3.7865 10.5581 3.7483 10.6641 3.61461C10.9425 3.26383 11.3131 3.00067 11.7358 2.85367C11.9191 2.78987 12.016 2.58943 11.9523 2.40605C11.8884 2.22277 11.6882 2.12592 11.5047 2.18953C11.0445 2.34966 10.6318 2.61578 10.2975 2.96603C10.1332 2.90078 9.96204 2.8539 9.78611 2.82611C9.16135 2.72715 8.53298 2.8742 8.01711 3.24054C7.56734 3.5599 7.24647 4.01474 7.09689 4.53839C6.04739 4.8203 5.24862 5.69674 5.0764 6.78411C4.99128 7.32178 5.0629 7.85874 5.2835 8.34963C5.12454 8.61696 5.01935 8.90904 4.96999 9.22072C4.75737 10.5649 5.67773 11.8317 7.02189 12.0446ZM17.4384 13.4074C17.6182 13.4074 17.7964 13.391 17.9717 13.3598C17.886 13.6823 17.6939 13.9633 17.4203 14.1621C17.1051 14.3911 16.7199 14.4837 16.335 14.4227C15.984 14.3671 15.666 14.1855 15.4396 13.9113C15.3571 13.8115 15.2262 13.765 15.0993 13.7905C14.9816 13.8142 14.8612 13.8166 14.7414 13.7976C14.5998 13.7752 14.4651 13.7227 14.3462 13.6452L14.2463 13.32C14.7413 13.2889 15.2058 13.0953 15.5727 12.7794C15.9746 13.0867 16.4455 13.2887 16.9523 13.369C17.1147 13.3947 17.2771 13.4074 17.4384 13.4074ZM13.0839 13.0815C13.2125 13.1468 13.3467 13.1992 13.4857 13.2385L14.3344 16.0004L13.213 15.8228C13.0751 15.8009 12.9566 15.707 12.9039 15.5776L12.0209 13.4116C12.3368 13.4265 12.762 13.3175 13.0839 13.0815Z"
          fill="black"
          stroke="black"
          stroke-width="0.5"
        />
        <Path
          d="M15.2733 8.56055C15.1359 8.69776 15.1357 8.92032 15.273 9.05772C15.4102 9.19516 15.6328 9.1952 15.7701 9.05805C16.2504 8.56636 16.6561 8.27648 16.7344 7.29345C16.7336 6.09934 15.7789 5.12793 14.6063 5.12793C14.0331 5.12793 13.4976 5.35509 13.1036 5.7518C12.7096 5.35509 12.1743 5.12793 11.6011 5.12793C10.4276 5.12793 9.4727 6.08279 9.47266 7.25642C9.47261 7.80749 9.66911 8.29369 10.04 8.66171L12.4982 11.1162C12.6651 11.2829 12.8843 11.3662 13.1035 11.3662C13.3227 11.3662 13.542 11.2829 13.7089 11.1162L14.6053 10.2211C14.7427 10.0839 14.7429 9.86131 14.6057 9.72392C14.4684 9.58652 14.2458 9.58634 14.1084 9.72354L13.212 10.6187C13.1523 10.6784 13.0548 10.6784 12.995 10.6186L10.5361 8.16333C10.3003 7.92946 10.1757 7.61586 10.1757 7.25647C10.1758 6.4705 10.8152 5.83107 11.6011 5.83107C12.0925 5.83107 12.5427 6.08148 12.8055 6.50092C12.8698 6.60349 12.9823 6.66583 13.1034 6.66583C13.2245 6.66583 13.337 6.60353 13.4013 6.50092C13.6642 6.08148 14.1146 5.83107 14.6062 5.83107C15.3781 5.83107 16.0306 6.50097 16.0311 7.29392C15.9942 7.94259 15.6178 8.20519 15.2733 8.56055Z"
          fill="black"
          stroke="black"
          stroke-width="0.5"
        />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default MentalHealthSvgIcon;
