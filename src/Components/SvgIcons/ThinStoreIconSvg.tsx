import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ThinStoreIconSvg(props) {
  const { height = 38, width = 46 } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 46 38" fill="none" {...props}>
      <Path
        d="M38.1189 1.11611L38.5608 0.674169V0.674169L38.1189 1.11611ZM44.5985 7.59573H45.2235C45.2235 7.42996 45.1577 7.27099 45.0405 7.15378L44.5985 7.59573ZM44.5985 19.475L44.7501 20.0814C45.0283 20.0118 45.2235 19.7618 45.2235 19.475H44.5985ZM40.2788 20.555L40.1272 19.9486C39.849 20.0182 39.6538 20.2682 39.6538 20.555H40.2788ZM27.3195 36.7998H26.6945C26.6945 37.145 26.9744 37.4248 27.3195 37.4248V36.7998ZM25.4116 27.0491L25.4837 26.4283C25.4717 26.4269 25.4596 26.4258 25.4476 26.4251L25.4116 27.0491ZM25.1597 27.0346L25.1957 26.4106C25.1837 26.4099 25.1717 26.4096 25.1597 26.4096V27.0346ZM18.6946 28.9426L18.0738 28.8704C18.0724 28.8824 18.0713 28.8945 18.0706 28.9066L18.6946 28.9426ZM18.6801 29.1944L18.0561 29.1584C18.0554 29.1704 18.0551 29.1824 18.0551 29.1944H18.6801ZM18.6801 36.7998V37.4248C19.0252 37.4248 19.3051 37.145 19.3051 36.7998H18.6801ZM5.72084 20.555H6.34584C6.34584 20.2682 6.15065 20.0182 5.87242 19.9486L5.72084 20.555ZM1.40109 19.475H0.776095C0.776095 19.7618 0.971281 20.0118 1.24951 20.0814L1.40109 19.475ZM1.40109 7.59573L0.959153 7.15378C0.841943 7.27099 0.776095 7.42996 0.776095 7.59573H1.40109ZM7.88071 1.11611L8.32265 1.55805V1.55805L7.88071 1.11611ZM9.22586 14.0753C9.22586 13.7302 8.94603 13.4503 8.60086 13.4503C8.25568 13.4503 7.97586 13.7302 7.97586 14.0753H9.22586ZM13.4005 18.3951V19.0201C13.4064 19.0201 13.4122 19.02 13.4181 19.0198L13.4005 18.3951ZM14.1254 18.3461L14.1852 18.9683C14.2006 18.9668 14.216 18.9647 14.2313 18.9621L14.1254 18.3461ZM14.4846 18.2845L14.5904 18.9004C14.6041 18.8981 14.6178 18.8953 14.6313 18.892L14.4846 18.2845ZM14.8097 18.2059L14.9564 18.8135C14.9666 18.811 14.9768 18.8083 14.9869 18.8053L14.8097 18.2059ZM14.9896 18.1527L15.1668 18.7521C15.1766 18.7492 15.1864 18.746 15.196 18.7427L14.9896 18.1527ZM15.2867 18.0488L15.4931 18.6387C15.503 18.6352 15.5127 18.6316 15.5224 18.6276L15.2867 18.0488ZM15.4662 17.9757L15.7019 18.5545C15.7119 18.5504 15.7218 18.5461 15.7316 18.5415L15.4662 17.9757ZM15.7618 17.8371L16.0272 18.4029C16.0401 18.3968 16.0529 18.3903 16.0654 18.3834L15.7618 17.8371ZM16.0716 17.6649L16.3752 18.2112C16.3873 18.2045 16.3992 18.1974 16.4108 18.1899L16.0716 17.6649ZM16.3189 17.5051L16.6581 18.0301C16.6677 18.0239 16.6772 18.0174 16.6864 18.0107L16.3189 17.5051ZM16.5075 17.368L16.875 17.8736C16.8848 17.8665 16.8943 17.8591 16.9036 17.8515L16.5075 17.368ZM16.9795 16.9538L17.4074 17.4093C17.418 17.3993 17.4283 17.389 17.4382 17.3783L16.9795 16.9538ZM17.1963 16.7194L17.655 17.144C17.6627 17.1357 17.6702 17.1272 17.6774 17.1185L17.1963 16.7194ZM17.4954 16.33L17.9982 16.7013C18.0029 16.6949 18.0075 16.6884 18.0119 16.6818L17.4954 16.33ZM17.8438 15.7119L18.4127 15.9708C18.4169 15.9615 18.4209 15.952 18.4247 15.9424L17.8438 15.7119ZM17.9903 15.3427L18.5713 15.5732C18.5751 15.5636 18.5787 15.5539 18.582 15.5441L17.9903 15.3427ZM18.8252 14.0753C18.8252 13.7302 18.5454 13.4503 18.2002 13.4503C17.855 13.4503 17.5752 13.7302 17.5752 14.0753H18.8252ZM22.9999 18.3951V19.0201C23.0058 19.0201 23.0116 19.02 23.0175 19.0198L22.9999 18.3951ZM23.7248 18.3461L23.7846 18.9683C23.8 18.9668 23.8154 18.9647 23.8306 18.9621L23.7248 18.3461ZM24.0839 18.2845L24.1897 18.9004C24.2035 18.8981 24.2171 18.8953 24.2307 18.892L24.0839 18.2845ZM24.409 18.2059L24.5558 18.8135C24.566 18.811 24.5762 18.8083 24.5862 18.8053L24.409 18.2059ZM24.589 18.1527L24.7662 18.7521C24.776 18.7492 24.7857 18.746 24.7954 18.7427L24.589 18.1527ZM24.8861 18.0488L25.0925 18.6387C25.1023 18.6352 25.1121 18.6316 25.1218 18.6276L24.8861 18.0488ZM25.0656 17.9757L25.3013 18.5545C25.3113 18.5504 25.3212 18.5461 25.331 18.5415L25.0656 17.9757ZM25.3612 17.8371L25.6265 18.4029C25.6395 18.3968 25.6522 18.3903 25.6647 18.3834L25.3612 17.8371ZM25.671 17.6649L25.9745 18.2112C25.9866 18.2045 25.9985 18.1974 26.0102 18.1899L25.671 17.6649ZM25.9183 17.5051L26.2575 18.0301C26.2671 18.0239 26.2765 18.0174 26.2858 18.0107L25.9183 17.5051ZM26.1069 17.368L26.4744 17.8736C26.4841 17.8665 26.4937 17.8591 26.503 17.8515L26.1069 17.368ZM26.5788 16.9538L27.0068 17.4093C27.0174 17.3993 27.0276 17.389 27.0375 17.3783L26.5788 16.9538ZM26.7957 16.7194L27.2544 17.144C27.2621 17.1357 27.2695 17.1272 27.2767 17.1185L26.7957 16.7194ZM27.0948 16.33L27.5975 16.7013C27.6022 16.6949 27.6068 16.6884 27.6113 16.6818L27.0948 16.33ZM27.4432 15.7119L28.012 15.9708C28.0163 15.9615 28.0203 15.952 28.0241 15.9424L27.4432 15.7119ZM27.5897 15.3427L28.1706 15.5732C28.1744 15.5636 28.178 15.5539 28.1814 15.5441L27.5897 15.3427ZM28.4246 14.0753C28.4246 13.7302 28.1448 13.4503 27.7996 13.4503C27.4544 13.4503 27.1746 13.7302 27.1746 14.0753H28.4246ZM32.5993 18.3951V19.0201C32.6051 19.0201 32.611 19.02 32.6168 19.0198L32.5993 18.3951ZM33.3242 18.3461L33.384 18.9683C33.3994 18.9668 33.4147 18.9647 33.43 18.9621L33.3242 18.3461ZM33.6833 18.2845L33.7891 18.9004C33.8028 18.8981 33.8165 18.8953 33.83 18.892L33.6833 18.2845ZM34.0084 18.2059L34.1551 18.8135C34.1654 18.811 34.1755 18.8083 34.1856 18.8053L34.0084 18.2059ZM34.1883 18.1527L34.3656 18.7521C34.3754 18.7492 34.3851 18.746 34.3947 18.7427L34.1883 18.1527ZM34.4854 18.0488L34.6918 18.6387C34.7017 18.6352 34.7115 18.6316 34.7211 18.6276L34.4854 18.0488ZM34.665 17.9757L34.9007 18.5545C34.9107 18.5504 34.9206 18.5461 34.9303 18.5415L34.665 17.9757ZM34.9605 17.8371L35.2259 18.4029C35.2389 18.3968 35.2516 18.3903 35.2641 18.3834L34.9605 17.8371ZM35.2703 17.6649L35.5739 18.2112C35.586 18.2045 35.5979 18.1974 35.6095 18.1899L35.2703 17.6649ZM35.5176 17.5051L35.8568 18.0301C35.8664 18.0239 35.8759 18.0174 35.8851 18.0107L35.5176 17.5051ZM35.7062 17.368L36.0737 17.8736C36.0835 17.8665 36.093 17.8591 36.1024 17.8515L35.7062 17.368ZM36.1782 16.9538L36.6061 17.4093C36.6167 17.3993 36.627 17.389 36.6369 17.3783L36.1782 16.9538ZM36.3951 16.7194L36.8538 17.144C36.8615 17.1357 36.8689 17.1272 36.8761 17.1185L36.3951 16.7194ZM36.6941 16.33L37.1969 16.7013C37.2016 16.6949 37.2062 16.6884 37.2107 16.6818L36.6941 16.33ZM37.0425 15.7119L37.6114 15.9708C37.6156 15.9615 37.6197 15.952 37.6235 15.9424L37.0425 15.7119ZM37.1891 15.3427L37.77 15.5732C37.7738 15.5636 37.7774 15.5539 37.7807 15.5441L37.1891 15.3427ZM37.399 14.0753L38.0234 14.0486C38.0088 13.7089 37.7254 13.4432 37.3856 13.4505C37.0457 13.4578 36.774 13.7354 36.774 14.0753H37.399ZM37.4135 14.4137L36.789 14.4405C36.7898 14.4575 36.7912 14.4744 36.7933 14.4913L37.4135 14.4137ZM37.451 14.7137L36.8308 14.7913C36.8329 14.8081 36.8357 14.8249 36.8392 14.8415L37.451 14.7137ZM37.5197 15.0425L36.9079 15.1703C36.9115 15.1875 36.9158 15.2045 36.9208 15.2213L37.5197 15.0425ZM37.7306 15.6563L37.1483 15.8833C37.1544 15.8991 37.1612 15.9146 37.1686 15.9299L37.7306 15.6563ZM38.0902 16.3099L37.5551 16.633C37.5629 16.6458 37.5712 16.6584 37.5798 16.6707L38.0902 16.3099ZM38.2043 16.4713L37.6939 16.8321C37.7016 16.843 37.7097 16.8536 37.7181 16.864L38.2043 16.4713ZM38.4297 16.7504L37.9435 17.1431C37.9534 17.1553 37.9637 17.1671 37.9744 17.1786L38.4297 16.7504ZM38.6412 16.9752L38.1859 17.4034C38.1963 17.4145 38.2071 17.4252 38.2183 17.4354L38.6412 16.9752ZM38.9029 17.2157L38.48 17.676C38.4909 17.6859 38.5021 17.6955 38.5136 17.7047L38.9029 17.2157ZM39.1402 17.4046L38.7509 17.8936C38.7635 17.9037 38.7766 17.9133 38.79 17.9223L39.1402 17.4046ZM39.5017 17.6492L39.1515 18.1668C39.1659 18.1766 39.1807 18.1857 39.1958 18.1942L39.5017 17.6492ZM39.8276 17.8321L39.5218 18.3771C39.5351 18.3846 39.5486 18.3916 39.5624 18.398L39.8276 17.8321ZM40.1458 17.9811L39.8806 18.5471C39.8937 18.5532 39.907 18.5589 39.9206 18.5642L40.1458 17.9811ZM40.4714 18.1069L40.2462 18.6899C40.2611 18.6957 40.2763 18.7009 40.2916 18.7055L40.4714 18.1069ZM40.8888 18.2323L40.709 18.8309C40.7223 18.8348 40.7357 18.8384 40.7492 18.8415L40.8888 18.2323ZM41.1342 18.2885L40.9947 18.8977C41.0036 18.8998 41.0125 18.9016 41.0215 18.9032L41.1342 18.2885ZM41.3367 18.3256L41.224 18.9405L41.2361 18.9425L41.3367 18.3256ZM41.8404 18.3832L41.799 19.0069C41.8059 19.0073 41.8128 19.0077 41.8198 19.0079L41.8404 18.3832ZM42.1986 18.3951L42.178 19.0197C42.1849 19.02 42.1917 19.0201 42.1986 19.0201V18.3951ZM44.5999 17.8164L44.8887 18.3707C45.0953 18.2631 45.2249 18.0494 45.2249 17.8164H44.5999ZM44.5999 9.75464H45.2249C45.2249 9.40946 44.9451 9.12964 44.5999 9.12964V9.75464ZM1.3999 9.75464V9.12964C1.05472 9.12964 0.774902 9.40946 0.774902 9.75464H1.3999ZM1.3999 17.8164H0.774902C0.774902 18.0494 0.904488 18.2631 1.1111 18.3707L1.3999 17.8164ZM3.80117 18.3951V19.0201C3.80703 19.0201 3.81288 19.02 3.81873 19.0198L3.80117 18.3951ZM4.52608 18.3461L4.58587 18.9683C4.60128 18.9668 4.61663 18.9647 4.63189 18.9621L4.52608 18.3461ZM4.88521 18.2845L4.99101 18.9004C5.00475 18.8981 5.01841 18.8953 5.03196 18.892L4.88521 18.2845ZM5.21029 18.2059L5.35704 18.8135C5.36727 18.811 5.37743 18.8083 5.38752 18.8053L5.21029 18.2059ZM5.39024 18.1527L5.56746 18.7521C5.57727 18.7492 5.587 18.746 5.59665 18.7427L5.39024 18.1527ZM5.68734 18.0488L5.89375 18.6387C5.90361 18.6352 5.91337 18.6316 5.92304 18.6276L5.68734 18.0488ZM5.86687 17.9757L6.10257 18.5545C6.11257 18.5504 6.12246 18.5461 6.13224 18.5415L5.86687 17.9757ZM6.16244 17.8371L6.42781 18.4029C6.44077 18.3968 6.45351 18.3903 6.46602 18.3834L6.16244 17.8371ZM6.47224 17.6649L6.77581 18.2112C6.78792 18.2045 6.7998 18.1974 6.81143 18.1899L6.47224 17.6649ZM6.71955 17.5051L7.05874 18.0301C7.06835 18.0239 7.07779 18.0174 7.08704 18.0107L6.71955 17.5051ZM6.90815 17.368L7.27565 17.8736C7.28539 17.8665 7.29494 17.8591 7.30426 17.8515L6.90815 17.368ZM7.38011 16.9538L7.80804 17.4093C7.81865 17.3993 7.82892 17.389 7.83881 17.3783L7.38011 16.9538ZM7.59698 16.7194L8.05568 17.144C8.06335 17.1357 8.0708 17.1272 8.07802 17.1185L7.59698 16.7194ZM7.89604 16.33L8.3988 16.7013C8.40351 16.6949 8.40811 16.6884 8.41258 16.6818L7.89604 16.33ZM8.24445 15.7119L8.81329 15.9708C8.81754 15.9615 8.82157 15.952 8.82536 15.9424L8.24445 15.7119ZM8.39098 15.3427L8.9719 15.5732C8.97572 15.5636 8.9793 15.5539 8.98263 15.5441L8.39098 15.3427ZM37.3553 1.4248C37.4759 1.4248 37.5916 1.47274 37.677 1.55805L38.5608 0.674169C38.2411 0.354431 37.8074 0.174805 37.3553 0.174805V1.4248ZM37.677 1.55805L44.1566 8.03767L45.0405 7.15378L38.5608 0.674169L37.677 1.55805ZM43.9735 7.59573V19.475H45.2235V7.59573H43.9735ZM44.4469 18.8687L40.1272 19.9486L40.4304 21.1613L44.7501 20.0814L44.4469 18.8687ZM39.6538 20.555V34.3998H40.9038V20.555H39.6538ZM39.6538 34.3998C39.6538 34.8337 39.4745 35.2909 39.1739 35.6377C38.8745 35.9831 38.4963 36.1748 38.1189 36.1748V37.4248C38.9344 37.4248 39.6361 37.0129 40.1184 36.4565C40.5995 35.9015 40.9038 35.1588 40.9038 34.3998H39.6538ZM38.1189 36.1748H27.3195V37.4248H38.1189V36.1748ZM27.9445 36.7998V29.1944H26.6945V36.7998H27.9445ZM27.9445 29.1944C27.9445 27.7658 26.8693 26.5892 25.4837 26.4283L25.3395 27.6699C26.1021 27.7585 26.6945 28.4077 26.6945 29.1944H27.9445ZM25.4476 26.4251L25.1957 26.4106L25.1237 27.6585L25.3756 27.6731L25.4476 26.4251ZM25.1597 26.4096H20.8399V27.6596H25.1597V26.4096ZM20.8399 26.4096C19.4113 26.4096 18.2347 27.4848 18.0738 28.8704L19.3154 29.0147C19.404 28.252 20.0532 27.6596 20.8399 27.6596V26.4096ZM18.0706 28.9066L18.0561 29.1584L19.304 29.2304L19.3186 28.9785L18.0706 28.9066ZM18.0551 29.1944V36.7998H19.3051V29.1944H18.0551ZM18.6801 36.1748H7.88071V37.4248H18.6801V36.1748ZM7.88071 36.1748C7.50336 36.1748 7.12512 35.9831 6.82571 35.6377C6.52508 35.2909 6.34584 34.8337 6.34584 34.3998H5.09584C5.09584 35.1588 5.4001 35.9015 5.88119 36.4565C6.3635 37.0129 7.0652 37.4248 7.88071 37.4248V36.1748ZM6.34584 34.3998V20.555H5.09584V34.3998H6.34584ZM5.87242 19.9486L1.55268 18.8687L1.24951 20.0814L5.56925 21.1613L5.87242 19.9486ZM2.02609 19.475V7.59573H0.776095V19.475H2.02609ZM1.84304 8.03767L8.32265 1.55805L7.43877 0.674169L0.959153 7.15378L1.84304 8.03767ZM8.32265 1.55805C8.40797 1.47274 8.52368 1.4248 8.64434 1.4248V0.174805C8.19216 0.174805 7.7585 0.354432 7.43877 0.674169L8.32265 1.55805ZM8.64434 1.4248H37.3553V0.174805H8.64434V1.4248ZM7.97586 14.0753C7.97586 16.8666 10.4681 19.0201 13.4005 19.0201V17.7701C11.0314 17.7701 9.22586 16.0556 9.22586 14.0753H7.97586ZM13.4181 19.0198L13.7228 19.0113L13.6876 17.7618L13.383 17.7703L13.4181 19.0198ZM13.765 19.0087L14.1852 18.9683L14.0657 17.724L13.6454 17.7644L13.765 19.0087ZM14.2313 18.9621L14.5904 18.9004L14.3788 17.6685L14.0196 17.7302L14.2313 18.9621ZM14.6313 18.892L14.9564 18.8135L14.6629 17.5984L14.3378 17.6769L14.6313 18.892ZM14.9869 18.8053L15.1668 18.7521L14.8124 17.5534L14.6324 17.6066L14.9869 18.8053ZM15.196 18.7427L15.4931 18.6387L15.0803 17.4588L14.7832 17.5628L15.196 18.7427ZM15.5224 18.6276L15.7019 18.5545L15.2305 17.3968L15.051 17.4699L15.5224 18.6276ZM15.7316 18.5415L16.0272 18.4029L15.4964 17.2712L15.2009 17.4098L15.7316 18.5415ZM16.0654 18.3834L16.3752 18.2112L15.768 17.1186L15.4582 17.2907L16.0654 18.3834ZM16.4108 18.1899L16.6581 18.0301L15.9797 16.9802L15.7324 17.14L16.4108 18.1899ZM16.6864 18.0107L16.875 17.8736L16.14 16.8625L15.9514 16.9996L16.6864 18.0107ZM16.9036 17.8515L17.1461 17.6528L16.3539 16.6859L16.1114 16.8846L16.9036 17.8515ZM17.1779 17.6248L17.4074 17.4093L16.5515 16.4982L16.3221 16.7138L17.1779 17.6248ZM17.4382 17.3783L17.655 17.144L16.7376 16.2949L16.5208 16.5292L17.4382 17.3783ZM17.6774 17.1185L17.7815 16.9929L16.8195 16.1948L16.7153 16.3204L17.6774 17.1185ZM17.8032 16.9652L17.9982 16.7013L16.9927 15.9587L16.7977 16.2226L17.8032 16.9652ZM18.0119 16.6818C18.1652 16.4569 18.2996 16.2192 18.4127 15.9708L17.275 15.453C17.1921 15.6351 17.093 15.8106 16.9789 15.9781L18.0119 16.6818ZM18.4247 15.9424L18.5713 15.5732L17.4094 15.1121L17.2629 15.4813L18.4247 15.9424ZM18.582 15.5441C18.7401 15.0799 18.8252 14.5863 18.8252 14.0753H17.5752C17.5752 14.4464 17.5135 14.8039 17.3987 15.1412L18.582 15.5441ZM17.5752 14.0753C17.5752 16.8666 20.0675 19.0201 22.9999 19.0201V17.7701C20.6307 17.7701 18.8252 16.0556 18.8252 14.0753H17.5752ZM23.0175 19.0198L23.3221 19.0113L23.287 17.7618L22.9823 17.7703L23.0175 19.0198ZM23.3644 19.0087L23.7846 18.9683L23.665 17.724L23.2448 17.7644L23.3644 19.0087ZM23.8306 18.9621L24.1897 18.9004L23.9781 17.6685L23.619 17.7302L23.8306 18.9621ZM24.2307 18.892L24.5558 18.8135L24.2623 17.5984L23.9372 17.6769L24.2307 18.892ZM24.5862 18.8053L24.7662 18.7521L24.4117 17.5534L24.2318 17.6066L24.5862 18.8053ZM24.7954 18.7427L25.0925 18.6387L24.6797 17.4588L24.3826 17.5628L24.7954 18.7427ZM25.1218 18.6276L25.3013 18.5545L24.8299 17.3968L24.6504 17.4699L25.1218 18.6276ZM25.331 18.5415L25.6265 18.4029L25.0958 17.2712L24.8002 17.4098L25.331 18.5415ZM25.6647 18.3834L25.9745 18.2112L25.3674 17.1186L25.0576 17.2907L25.6647 18.3834ZM26.0102 18.1899L26.2575 18.0301L25.5791 16.9802L25.3318 17.14L26.0102 18.1899ZM26.2858 18.0107L26.4744 17.8736L25.7394 16.8625L25.5508 16.9996L26.2858 18.0107ZM26.503 17.8515L26.7455 17.6528L25.9533 16.6859L25.7108 16.8846L26.503 17.8515ZM26.7773 17.6248L27.0068 17.4093L26.1509 16.4982L25.9215 16.7138L26.7773 17.6248ZM27.0375 17.3783L27.2544 17.144L26.337 16.2949L26.1201 16.5292L27.0375 17.3783ZM27.2767 17.1185L27.3809 16.9929L26.4188 16.1948L26.3147 16.3204L27.2767 17.1185ZM27.4026 16.9652L27.5975 16.7013L26.592 15.9587L26.3971 16.2226L27.4026 16.9652ZM27.6113 16.6818C27.7646 16.4569 27.8989 16.2192 28.012 15.9708L26.8743 15.453C26.7914 15.6351 26.6923 15.8106 26.5782 15.9781L27.6113 16.6818ZM28.0241 15.9424L28.1706 15.5732L27.0088 15.1121L26.8623 15.4813L28.0241 15.9424ZM28.1814 15.5441C28.3394 15.0799 28.4246 14.5863 28.4246 14.0753H27.1746C27.1746 14.4464 27.1129 14.8039 26.9981 15.1412L28.1814 15.5441ZM27.1746 14.0753C27.1746 16.8666 29.6669 19.0201 32.5993 19.0201V17.7701C30.2301 17.7701 28.4246 16.0556 28.4246 14.0753H27.1746ZM32.6168 19.0198L32.9215 19.0113L32.8864 17.7618L32.5817 17.7703L32.6168 19.0198ZM32.9637 19.0087L33.384 18.9683L33.2644 17.724L32.8441 17.7644L32.9637 19.0087ZM33.43 18.9621L33.7891 18.9004L33.5775 17.6685L33.2184 17.7302L33.43 18.9621ZM33.83 18.892L34.1551 18.8135L33.8616 17.5984L33.5365 17.6769L33.83 18.892ZM34.1856 18.8053L34.3656 18.7521L34.0111 17.5534L33.8312 17.6066L34.1856 18.8053ZM34.3947 18.7427L34.6918 18.6387L34.279 17.4588L33.9819 17.5628L34.3947 18.7427ZM34.7211 18.6276L34.9007 18.5545L34.4293 17.3968L34.2497 17.4699L34.7211 18.6276ZM34.9303 18.5415L35.2259 18.4029L34.6952 17.2712L34.3996 17.4098L34.9303 18.5415ZM35.2641 18.3834L35.5739 18.2112L34.9668 17.1186L34.657 17.2907L35.2641 18.3834ZM35.6095 18.1899L35.8568 18.0301L35.1784 16.9802L34.9311 17.14L35.6095 18.1899ZM35.8851 18.0107L36.0737 17.8736L35.3388 16.8625L35.1501 16.9996L35.8851 18.0107ZM36.1024 17.8515L36.3449 17.6528L35.5526 16.6859L35.3101 16.8846L36.1024 17.8515ZM36.3767 17.6248L36.6061 17.4093L35.7503 16.4982L35.5208 16.7138L36.3767 17.6248ZM36.6369 17.3783L36.8538 17.144L35.9364 16.2949L35.7195 16.5292L36.6369 17.3783ZM36.8761 17.1185L36.9803 16.9929L36.0182 16.1948L35.914 16.3204L36.8761 17.1185ZM37.002 16.9652L37.1969 16.7013L36.1914 15.9587L35.9965 16.2226L37.002 16.9652ZM37.2107 16.6818C37.3639 16.4569 37.4983 16.2192 37.6114 15.9708L36.4737 15.453C36.3908 15.6351 36.2917 15.8106 36.1776 15.9781L37.2107 16.6818ZM37.6235 15.9424L37.77 15.5732L36.6082 15.1121L36.4616 15.4813L37.6235 15.9424ZM37.7807 15.5441C37.9388 15.0799 38.024 14.5863 38.024 14.0753H36.774C36.774 14.4464 36.7123 14.8039 36.5974 15.1412L37.7807 15.5441ZM36.7745 14.1021L36.789 14.4405L38.0379 14.3869L38.0234 14.0486L36.7745 14.1021ZM36.7933 14.4913L36.8308 14.7913L38.0712 14.6361L38.0336 14.3361L36.7933 14.4913ZM36.8392 14.8415L36.9079 15.1703L38.1315 14.9146L38.0628 14.5858L36.8392 14.8415ZM36.9208 15.2213L37.0139 15.5331L38.2117 15.1755L38.1186 14.8637L36.9208 15.2213ZM37.0305 15.5813L37.1483 15.8833L38.3129 15.4292L38.1951 15.1272L37.0305 15.5813ZM37.1686 15.9299L37.3144 16.2294L38.4383 15.6823L38.2925 15.3827L37.1686 15.9299ZM37.3414 16.2789L37.5551 16.633L38.6252 15.9868L38.4114 15.6328L37.3414 16.2789ZM37.5798 16.6707L37.6939 16.8321L38.7146 16.1105L38.6005 15.9491L37.5798 16.6707ZM37.7181 16.864L37.9435 17.1431L38.9159 16.3577L38.6905 16.0785L37.7181 16.864ZM37.9744 17.1786L38.1859 17.4034L39.0965 16.5471L38.885 16.3222L37.9744 17.1786ZM38.2183 17.4354L38.48 17.676L39.3258 16.7555L39.0641 16.515L38.2183 17.4354ZM38.5136 17.7047L38.7509 17.8936L39.5295 16.9157L39.2922 16.7268L38.5136 17.7047ZM38.79 17.9223L39.1515 18.1668L39.8518 17.1315L39.4903 16.8869L38.79 17.9223ZM39.1958 18.1942L39.5218 18.3771L40.1335 17.287L39.8075 17.1041L39.1958 18.1942ZM39.5624 18.398L39.8806 18.5471L40.4109 17.4152L40.0928 17.2661L39.5624 18.398ZM39.9206 18.5642L40.2462 18.6899L40.6966 17.5239L40.3709 17.3981L39.9206 18.5642ZM40.2916 18.7055L40.709 18.8309L41.0685 17.6337L40.6511 17.5083L40.2916 18.7055ZM40.7492 18.8415L40.9947 18.8977L41.2738 17.6793L41.0283 17.623L40.7492 18.8415ZM41.0215 18.9032L41.224 18.9404L41.4495 17.7109L41.247 17.6737L41.0215 18.9032ZM41.2361 18.9425C41.4208 18.9726 41.6086 18.9942 41.799 19.0069L41.8818 17.7596C41.7312 17.7496 41.5829 17.7325 41.4374 17.7088L41.2361 18.9425ZM41.8198 19.0079L42.178 19.0197L42.2193 17.7704L41.8611 17.7586L41.8198 19.0079ZM42.1986 19.0201C43.1741 19.0201 44.0933 18.7851 44.8887 18.3707L44.3111 17.2622C43.6939 17.5838 42.9728 17.7701 42.1986 17.7701V19.0201ZM45.2249 17.8164V9.75464H43.9749V17.8164H45.2249ZM44.5999 9.12964H1.3999V10.3796H44.5999V9.12964ZM0.774902 9.75464V17.8164H2.0249V9.75464H0.774902ZM1.1111 18.3707C1.90649 18.7851 2.8257 19.0201 3.80117 19.0201V17.7701C3.027 17.7701 2.3059 17.5838 1.6887 17.2622L1.1111 18.3707ZM3.81873 19.0198L4.1234 19.0113L4.08828 17.7618L3.78362 17.7703L3.81873 19.0198ZM4.16563 19.0087L4.58587 18.9683L4.4663 17.724L4.04605 17.7644L4.16563 19.0087ZM4.63189 18.9621L4.99101 18.9004L4.7794 17.6685L4.42028 17.7302L4.63189 18.9621ZM5.03196 18.892L5.35704 18.8135L5.06354 17.5984L4.73845 17.6769L5.03196 18.892ZM5.38752 18.8053L5.56746 18.7521L5.21301 17.5534L5.03306 17.6066L5.38752 18.8053ZM5.59665 18.7427L5.89375 18.6387L5.48093 17.4588L5.18382 17.5628L5.59665 18.7427ZM5.92304 18.6276L6.10257 18.5545L5.63117 17.3968L5.45164 17.4699L5.92304 18.6276ZM6.13224 18.5415L6.42781 18.4029L5.89708 17.2712L5.60151 17.4098L6.13224 18.5415ZM6.46602 18.3834L6.77581 18.2112L6.16867 17.1186L5.85887 17.2907L6.46602 18.3834ZM6.81143 18.1899L7.05874 18.0301L6.38035 16.9802L6.13305 17.14L6.81143 18.1899ZM7.08704 18.0107L7.27565 17.8736L6.54066 16.8625L6.35206 16.9996L7.08704 18.0107ZM7.30426 17.8515L7.54676 17.6528L6.75454 16.6859L6.51204 16.8846L7.30426 17.8515ZM7.57858 17.6248L7.80804 17.4093L6.95218 16.4982L6.72272 16.7138L7.57858 17.6248ZM7.83881 17.3783L8.05568 17.144L7.13828 16.2949L6.92141 16.5292L7.83881 17.3783ZM8.07802 17.1185L8.18217 16.9929L7.22009 16.1948L7.11594 16.3204L8.07802 17.1185ZM8.20388 16.9652L8.3988 16.7013L7.39329 15.9587L7.19837 16.2226L8.20388 16.9652ZM8.41258 16.6818C8.56583 16.4569 8.7002 16.2192 8.81329 15.9708L7.6756 15.453C7.59271 15.6351 7.49359 15.8106 7.3795 15.9781L8.41258 16.6818ZM8.82536 15.9424L8.9719 15.5732L7.81007 15.1121L7.66353 15.4813L8.82536 15.9424ZM8.98263 15.5441C9.14069 15.0799 9.22586 14.5863 9.22586 14.0753H7.97586C7.97586 14.4464 7.91417 14.8039 7.79933 15.1412L8.98263 15.5441Z"
        fill="#22222D"
      />
    </Svg>
  );
}

export default ThinStoreIconSvg;