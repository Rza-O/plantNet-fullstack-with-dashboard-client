/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'


const SellerOrderDataRow = ({ orderData, refetch }) => {
  const axiosSecure = useAxiosSecure()
  const { name, customer, price, quantity, _id, address, status, plantId } = orderData || {};
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)

  const handleDelete = async () => {
    try {
      // fetch
      await axiosSecure.delete(`/order/${_id}`)
      // increasing quantity in the db
      await axiosSecure.patch(`/plants/quantity/${plantId}`, {
        quantityToUpdate: quantity,
        status: 'increase',
      })
      // call refetch to refresh ui
      refetch();
      toast.success('Order has been cancelled!')
    } catch (error) {
      console.log(error)
      toast.error(error.response.data)
    } finally {
      closeModal()
    }
  }

  const handleStatus = async (newStatus) => {
    if (status === newStatus) return

    // patch request to server
    try {
      // update order status
      await axiosSecure.patch(`/orders/${_id}`, {
        status: newStatus,
      })
      refetch();
      toast.success('Status Updated');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{customer?.email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{quantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{address}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{status}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center gap-2'>
          <select
            required
            onChange={(e) => handleStatus(e.target.value)}
            className='p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white'
            name='category'
            disabled={status === "Delivered"}
            defaultValue={status}
          >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>Start Processing</option>
            <option value='Delivered'>Deliver</option>
          </select>
          <button
            onClick={() => setIsOpen(true)}
            className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Cancel</span>
          </button>
        </div>
        <DeleteModal handleDelete={handleDelete} isOpen={isOpen} closeModal={closeModal} />
      </td>
    </tr>
  )
}

SellerOrderDataRow.propTypes = {
  order: PropTypes.object,
  refetch: PropTypes.func,
}

export default SellerOrderDataRow
