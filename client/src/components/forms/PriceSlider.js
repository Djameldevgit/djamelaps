import React from 'react';
import { Form } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PriceSlider = ({ postData, setPostData }) => (
    <Form.Group className="mb-3">
        <Form.Label>Prix par Personne: <strong>{postData.price} DA</strong></Form.Label>
        <div style={{ padding: '0 20px' }}>
            <Slider
                min={500}
                max={2000000}
                step={500}
                value={postData.price || 0}
                onChange={(value) => {
                    setPostData(prevState => ({
                        ...prevState,
                        price: value
                    }));
                }}
                trackStyle={{ backgroundColor: '#44EB00', height: 10 }}
                handleStyle={{
                    borderColor: '#00AF72',
                    height: 20,
                    width: 20,
                    marginLeft: -10,
                    marginTop: -5,
                    backgroundColor: '#007bff',
                }}
                railStyle={{ backgroundColor: '#ccc', height: 10 }}
            />
        </div>
    </Form.Group>
);

export default PriceSlider;