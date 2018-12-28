import LinkedRow from './LinkedRow';
import LinkedCol from './LinkedCol';
import CodeViewer from './CodeViewer';
import Header from './Header';
import Section from './Section';
import LinkedText from './LinkedText';
import LinkedImage from './LinkedImage';

const defaultComponents = {
    "row": LinkedRow,
    "col": LinkedCol,
    "code": CodeViewer,
    "header": Header,
    "section": Section,
    "text": LinkedText,
    "image": LinkedImage
};

export const mergeLinkedComponents = (data) => {
    return { ...defaultComponents, ...data };
}

export default {
    LinkedCol,
    LinkedRow,
    LinkedText,
    LinkedImage,
    CodeViewer,
    Header,
    Section
};