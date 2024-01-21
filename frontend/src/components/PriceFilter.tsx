type Props = {
    seletedPrice?: number
    onChange: (value?: number) => void
}

const PriceFilter = ({ seletedPrice, onChange }: Props) => {
    return (
        <div className="border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Max Price</h4>
            <select className="p-2 border rounded-md w-full"
                value={seletedPrice}
                onChange={(event) => onChange(event.target.value
                    ? parseInt(event.target.value)
                    : undefined)}>
                <option value="">Select Max Price</option>
                {[50, 100, 200, 300, 500].map((price, index) => (
                    <option value={price} key={index}>{price}</option>
                ))}
            </select>
        </div>
    )
}

export default PriceFilter