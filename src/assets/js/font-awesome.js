// Font Awesome file to keep main.js from being cluttered

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAtlas } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faBehanceSquare } from "@fortawesome/free-brands-svg-icons";

library.add(faAtlas);
library.add(faGithubSquare);
library.add(faLinkedin);
library.add(faFacebookSquare);
library.add(faInstagramSquare);
library.add(faTwitterSquare);
library.add(faBehanceSquare);
library.add(faUser);
library.add(faHeart);
library.add(faHome);
library.add(faMusic);

export default FontAwesomeIcon;
